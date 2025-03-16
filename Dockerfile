## syntax = docker/dockerfile:1
#
## Make sure RUBY_VERSION matches the Ruby version in .ruby-version and Gemfile
#ARG RUBY_VERSION=3.3.5
#FROM ruby:$RUBY_VERSION-slim as base
#
## Rails app lives here
#WORKDIR /rails
#
## Set production environment
#ENV RAILS_ENV="production" \
#    BUNDLE_WITHOUT="development:test" \
#    BUNDLE_DEPLOYMENT="1" \
#    DOCKER_BUILDKIT="1"
#
## Update gems and bundler
#RUN gem update --system --no-document && \
#    gem install -N bundler
#
## Throw-away build stages to reduce size of final image
#FROM base as prebuild
#
## Install packages needed to build gems and node modules
#
#
#FROM prebuild as node
#
## Install JavaScript dependencies
#
#
#FROM prebuild as build
#RUN apt-get update -qq && \
#    apt-get install --no-install-recommends -y build-essential curl node-gyp pkg-config python-is-python3 git openssh-client libpq-dev
## Install application gems
#COPY --link Gemfile Gemfile.lock ./
#RUN --mount=type=ssh bundle install && \
#    bundle exec bootsnap precompile --gemfile && \
#    rm -rf ~/.bundle/ $BUNDLE_PATH/ruby/*/cache $BUNDLE_PATH/ruby/*/bundler/gems/*/.git
#
## Copy node modules
##COPY --from=node /rails/node_modules /rails/node_modules
##COPY --from=node /usr/local/node /usr/local/node
##ENV PATH=/usr/local/node/bin:$PATH
#
## Copy application code
#COPY --link . .
#
## Precompile bootsnap code for faster boot times
#RUN bundle exec bootsnap precompile app/ lib/
#
#
#
#ARG NODE_VERSION=23.9.0
#ENV PATH=/usr/local/node/bin:$PATH
#RUN curl -sL https://github.com/nodenv/node-build/archive/master.tar.gz | tar xz -C /tmp/ && \
#    /tmp/node-build-master/bin/node-build "${NODE_VERSION}" /usr/local/node && \
#    npm install -g npm@latest && \
#    npm install -g yarn && \
#    rm -rf /tmp/node-build-master
#
## Install node modules
##COPY --link package.json yarn.lock ./
#RUN mkdir -p -m 0700 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts && \
#    corepack enable && \
#    echo "$SSH_AUTH_SOCK"
##    ssh -Tv git@github.com
##RUN git config --global url.https://github.com/.insteadOf git@github.com:
#
#
#RUN rm -rf node_modules package-lock.json yarn.lock
#RUN npm cache clear --force
#RUN yarn install
## Precompiling assets for production without requiring secret RAILS_MASTER_KEY
#RUN SECRET_KEY_BASE=DUMMY ./bin/rails assets:precompile
#
## Final stage for app image
#FROM base
#
## Install packages needed for deployment
#RUN apt-get update -qq && \
#    apt-get install --no-install-recommends -y curl libsqlite3-0 && \
#    rm -rf /var/lib/apt/lists /var/cache/apt/archives
#
## Copy built artifacts: gems, application
#COPY --from=build "${BUNDLE_PATH}" "${BUNDLE_PATH}"
##COPY --from=build /rails /rails
#
## Run and own only the runtime files as a non-root user for security
##RUN groupadd --system --gid 1000 rails && \
##    useradd rails --uid 1000 --gid 1000 --create-home --shell /bin/bash && \
##    chown -R rails:rails db log storage tmp
##USER 1000:1000
#
## Deployment options
#ENV RAILS_LOG_TO_STDOUT="1" \
#    RAILS_SERVE_STATIC_FILES="true"
#
## Entrypoint prepares the database.
#ENTRYPOINT ["/rails/bin/docker-entrypoint"]
#
## Start the server by default, this can be overwritten at runtime
#EXPOSE 80
#CMD ["./bin/rails", "server"]

# syntax = docker/dockerfile:1

# Make sure RUBY_VERSION matches the Ruby version in .ruby-version and Gemfile
ARG RUBY_VERSION=3.3.5
FROM ruby:$RUBY_VERSION-slim
SHELL ["/bin/bash", "-c"]

WORKDIR /rails

RUN apt-get update -qq && apt-get install -yq --no-install-recommends \
    build-essential \
    gnupg2 \
    less \
    git \
    libpq-dev \
    postgresql-client \
    libvips42 \
    node-gyp \
    curl  \
    pkg-config \
    python-is-python3 \
    openssh-client \
    libjemalloc2 \
    libvips \
    libffi-dev \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*


ENV LANG=C.UTF-8 \
  BUNDLE_JOBS=4 \
  BUNDLE_RETRY=3

RUN gem update --system && gem install bundler


# Deployment options
ENV RAILS_LOG_TO_STDOUT="1" \
    RAILS_SERVE_STATIC_FILES="true"

COPY --link . .

#RUN bundle install

SHELL ["/bin/bash", "--login", "-i", "-c"]
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
RUN source /root/.bashrc && nvm install 23.9.0
RUN git config --global url."https://github.com/".insteadOf git@github.com:
RUN git config --global url."https://".insteadOf ssh://
SHELL ["/bin/bash", "--login", "-c"]
RUN npm install -g yarn
RUN rm package-lock.json
RUN yarn cache clean

RUN yarn install
RUN bundle install
RUN yarn build
RUN yarn build:css
RUN yarn build:css:fontawesome
#RUN chmod +x ./docker-entrypoint.sh

# Entrypoint prepares the database.
ENTRYPOINT ["/rails/docker-entrypoint"]

# Start the server by default, this can be overwritten at runtime
EXPOSE 80
CMD ["./bin/rails", "server", "--binding", "0.0.0.0"]
#CMD ["bundle", "exec", "rails", "s", "-b", "0.0.0.0"]
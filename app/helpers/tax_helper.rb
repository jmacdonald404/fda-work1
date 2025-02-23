module TaxHelper
  def with_tax(amount)
    amount += (amount * 0.05).round
    '%.2f' % amount.to_f
  end
end

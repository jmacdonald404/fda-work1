var $dropdown = $(".dropdown > .dropdown-group");
var $dropdownToggle = $(".dropdown-toggle");
var $dropdownMenu = $(".dropdown-menu");
var showClass = "show";

if (window.matchMedia("(min-width: 768px)").matches) {
// $('body').on('click','.dropdown-toggle',function(e){
$('body').on('click',function(e){
  $dropdownMenu.removeClass(showClass);
  $dropdownToggle.removeClass(showClass);
  $('.btn-group').removeClass(showClass);
  // $dropdownToggle.attr("aria-expanded", "false");
  if(e.target.class == "dropdown-toggle" || "type-item"){
    const $this = $(e.target);
    console.log($this.closest('.btn-group').find($dropdownToggle).attr("aria-expanded"));
    if($this.closest('.btn-group').find($dropdownToggle).attr("aria-expanded") == "true"){
      console.log('ok')
      $dropdownMenu.removeClass(showClass);
      $dropdownToggle.removeClass(showClass);
      $('.btn-group').removeClass(showClass);
      $dropdownToggle.attr("aria-expanded", "false");
    } else {
      // console.log($this.closest('.btn-group').find($dropdownToggle))
      // console.log($this.closest('.btn-group').find($dropdownMenu))
      // console.log($this)
      $dropdownToggle.attr("aria-expanded", "false");
      $this.closest('.btn-group').find($dropdownToggle).attr("aria-expanded", "true");
      $this.closest('.btn-group').find($dropdownMenu).addClass(showClass);
      $this.closest('.btn-group').addClass(showClass);
    }
  }
});

$dropdown.hover(
  function() {
    const $this = $(this);
    $this.addClass(showClass);
    $this.find($dropdownToggle).attr("aria-expanded", "true");
    $this.find($dropdownMenu).addClass(showClass);
  },
  function() {
    const $this = $(this);
    $this.removeClass(showClass);
    $this.find($dropdownToggle).attr("aria-expanded", "false");
    $this.find($dropdownMenu).removeClass(showClass);
  }
);
} else {
$dropdown.off("mouseenter mouseleave");
}

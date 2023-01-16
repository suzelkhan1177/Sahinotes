window.onunload = function(){};
// for chrome
if (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD) {
    location.reload();
}
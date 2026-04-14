/**
 * 待机加载动效 - 页面就绪后淡出
 */
(function () {
    function hideLoader() {
        var loader = document.getElementById('page-loader');
        if (loader) loader.classList.add('hidden');
    }
    if (document.readyState === 'complete') {
        setTimeout(hideLoader, 100);
    } else {
        window.addEventListener('load', function () { setTimeout(hideLoader, 150); });
    }
})();

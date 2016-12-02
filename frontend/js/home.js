(($) => {
    const $activeArea = $('.terminal-input');
    const $input = $('.terminal-input input');
    const $history = $('.terminal-history');
    const createNewHistory = res => {
        $history.append(`<p class="terminal-line -history">${res.input}</p>`);
        $history.append(`<p class="terminal-line -response">${res.output}</p>`);
    };

    $input.focus();
    
    $('body').on('click', e => {
        if ($(e.target).closest('.terminal-history').length) return;
        $input.focus();
    });

    $input.on('keypress', e => {
        // keyCode 13 is Enter
        if (e.keyCode !== 13) return;
        $activeArea.addClass('hidden');
        $.post(`${window.location.origin}/terminal-input`, { input: $input.val() }, res => {
            createNewHistory(res);
            $activeArea.removeClass('hidden');
            $input.val('').focus();
        });
    });
})(jQuery);
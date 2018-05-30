$(document).ready(function() {
    $('.delete-record').on('click', function(e) {
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/record/'+id,
            success: function(response) {
                alert('Deleting record');
                window.location.href='/';
            },
            error: function(err) {
                console.log(err);
            }
        });
    });
});
$(document).ready(function () {
    var progressbar;

    $.getScript( "frontend/includes/nanobar.min.js" )
        .done(function( script, textStatus ){
            progressbar = new Nanobar( {classname: 'progress-bar'});
            progressbar.go(30);
        })
        .fail(function( jqxhr, settings, exception ) {
            alert(exception);
        });

    $.getScript( "frontend/ProjectController.js" )
        .done(function( script, textStatus ) {
            progressbar.go(100);
        })
        .fail(function( jqxhr, settings, exception ) {
            alert(exception);
        });
});
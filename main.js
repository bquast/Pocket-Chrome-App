//Listens for app events

checkIfUserIsLoggedInAndLogoutIf = false;

chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === "install") {
        checkIfUserIsLoggedInAndLogoutIf = true;
    }
});


chrome.app.runtime.onLaunched.addListener(function() {
    init();
});




// Init process

function init()
{
    showMainWindow();
}


// Window handling

var mainWindow;
function showMainWindow()
{
    // On startup save an opened app action to the local settings so we can
    // push it later
    chrome.storage.local.get('openedAppActions', function(receivedData) {
        var openedAppActions = receivedData.openedAppActions ? JSON.parse(receivedData.openedAppActions) : [];

        var openedAppAction = {
            action: "opened_app",
            time: "" + Math.round(+new Date() / 1000)
        };
        openedAppActions.push(openedAppAction);

        chrome.storage.local.set({'openedAppActions': JSON.stringify(openedAppActions)}, function() {});
    });

    // Create and open the main window
    chrome.app.window.create('a/index.html', {
        id: 'main',
        bounds: {
            width: 1040,
            height: 800
        }
    }, function (win) {
        mainWindow = win;

        // Register the on closed event to save on closed actions
        mainWindow.onClosed.addListener(function() {

            // On main window close save closed app action in local settings to push
            // to API later
            chrome.storage.local.get('closedAppActions', function(receivedData) {
                var closedAppActions = receivedData.closedAppActions ? JSON.parse(receivedData.closedAppActions) : [];

                var closedAppAction = {
                    action: "closed_app",
                    time: "" + Math.round(+new Date() / 1000)
                };
                closedAppActions.push(closedAppAction);

                chrome.storage.local.set({'closedAppActions': JSON.stringify(closedAppActions)}, function() {});
            });
        });
    });
}
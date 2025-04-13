
function progressiveOfflineSpeedup(multiplicationPercentByElapsedHour, enabledNotification) {
    let originalStartTime = game._offlineInfo.startTime
    let currentTime = Date.now();
    let elapsedTime = currentTime - originalStartTime;
    let elapsedHours = Math.floor(elapsedTime / 36e5)
    let multiplicatorPercent = 100;

    if (elapsedHours < 1) {
        return;
    }

    for (let i = 1; i <= elapsedHours; i++) {
        if (multiplicationPercentByElapsedHour[i] == undefined) {
            continue;
        }
        multiplicatorPercent = multiplicationPercentByElapsedHour[i];
    }

    if (enabledNotification) {
        Swal.fire({
            title: 'Your offline time was speed up!',
            text: 'Speed up applied: ' + multiplicatorPercent + '%',
            icon: 'success',
            confirmButtonText: 'Yay!'
        });
    }

    let newElapsedTime = Math.floor(elapsedTime * (multiplicatorPercent / 100));
    game._offlineInfo.startTime = currentTime - newElapsedTime;
}


export function setup(ctx) {
    ctx.onCharacterLoaded(ctx => {

        let settingsGeneral = ctx.settings.section('General');

        settingsGeneral.add({
            type: 'switch',
            name: 'enable-progressive-offline-speedup',
            label: 'Enable Progressive Offline Speedup',
            default: true
        });

        settingsGeneral.add({
            type: 'switch',
            name: 'progressive-offline-speedup-enable-notification',
            label: 'Enable notification',
            default: false
        });

        let settingsSpeedupStages = ctx.settings.section('Speedup stages');

        settingsSpeedupStages.add([
            {
                type: 'number',
                name: 'progressive-offline-speedup-1h-multiplier',
                label: 'After 1 hour (%)',
                default: 120
            },
            {
                type: 'number',
                name: 'progressive-offline-speedup-2h-multiplier',
                label: 'After 2 hours (%)',
                default: 150
            },
            {
                type: 'number',
                name: 'progressive-offline-speedup-4h-multiplier',
                label: 'After 4 hours (%)',
                default: 200
            },
            {
                type: 'number',
                name: 'progressive-offline-speedup-8h-multiplier',
                label: 'After 8 hours (%)',
                default: 250
        }]);
    
        function run() {
            if (settingsGeneral.get('enable-progressive-offline-speedup') == false) {
                console.log('Progressive offline speedup is disabled');
                return;
            }
            let multiplicationPercentByElapsedHour = {
                1: settingsSpeedupStages.get('progressive-offline-speedup-1h-multiplier'),
                2: settingsSpeedupStages.get('progressive-offline-speedup-2h-multiplier'),
                4: settingsSpeedupStages.get('progressive-offline-speedup-4h-multiplier'),
                8: settingsSpeedupStages.get('progressive-offline-speedup-8h-multiplier')
            };
            progressiveOfflineSpeedup(multiplicationPercentByElapsedHour, settingsGeneral.get('progressive-offline-speedup-enable-notification'));
        }
        
        ctx.patch(Game, 'enterOfflineLoop').after(run);
    });
}

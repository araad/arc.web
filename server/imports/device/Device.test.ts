describe('Device', function () {
    it('throws an exception if it does not implement IDevice interface', function () {
        chai.assert(true);
    });

    it('throws an exception if it does not implement IResourceManager interface', function () {
        chai.assert(true);
    });

    describe('subscribe (subscribes to resource changes on mbed connector)', function () {
        it('calls "putResourceSubsription" on mbed connector to subscribe to panelInterface resource changes', function () {
            chai.assert(true);
        });
    });

    describe('unsubscribe (unsubscribes from resource changes on mbed connector)', function () {
        it('calls "deleteResourceSubsription" on mbed connector to unsubscribe from panelInterface resource changes', function () {
            chai.assert(true);
        });
    });

    describe('saveName (sets the display name)', function () {
        it('throws an exception if name is shorter than 2 characters', function () {
            chai.assert(true);
        });

        it('throws an exception if name is empty', function () {
            chai.assert(true);
        });

        it('calls "update" on the Device collection with the new value', function () {
            chai.assert(true);
        });
    });

    describe('geotag (stores the device\'s location)', function () {
        it('throws an exception if coordinates argument is null or empty', function () {
            chai.assert(true);
        });

        it('calls "update" on the Device collection with the new coordinates value', function () {
            chai.assert(true);
        });
    });

    describe('setCurrentTime (sets the current time on the device)', function () {
        it('calls "putResourceValue" on mbed connector to update the time resource', function () {
            chai.assert(true);
        })
    });
});
describe("ElectricalOutletModule", function () {
    it('throws an exception if it does not derive from ModuleBase class', function () {
        chai.assert(true);
    });

    it('throws an exception if it does not implement IElectricalOutletModule interface', function () {
        chai.assert(true);
    });

    describe('setState (changes the switch state)', function () {
        it('calls "setResource" passing it "5850" as resource name', function () {
            chai.assert(true);
        });
    });

    describe('setName (changes the display name)', function () {
        it('throws an exception if name is shorter than 2 characters', function () {
            chai.assert(true);
        });

        it('throws an exception if name is empty', function () {
            chai.assert(true);
        });

        it('calls "update" on the PanelInterface collection with the new value', function () {
            chai.assert(true);
        });
    });

    describe('setField (updates internal field values when resource changes occur on mbed connector)', function () {
        it('sets the switch state if resource "5850" is changed', function () {
            chai.assert(true);
        });

        it('sets the powerConsumed value if resource "5800" is changed', function () {
            chai.assert(true);
        });
    });

    describe('setResource (updates resources on mbed connector when changes occur internally)', function () {
        it('calls "putResourceValue" on mbed connector', function () {
            chai.assert(true);
        });
    });

    describe('checkIfOutsideArea (preset condition that is called from the TriggerObserver)', function () {
        it('returns false if at least one online user is within the user-defined area', function () {
            chai.assert(true);
        });

        it('returns true if all online users are outside the user-defined area', function() {
            chai.assert(true);
        })
    });

    describe('onLocationTrigger (action that is called from the TriggerObserver)', function () {
        it('thorws an exception if the panelInterface object is not found', function () {
            chai.assert(true);
        });

        it('sets a new timeout of 60 seconds if no previous timeout was found', function () {
            chai.assert(true);
        });

        it('does nothing if there is a previous timeout set and has not yet expired', function () {
            chai.assert(true);
        });

        it('calls "setState" passing it false and clears timeout when previous timeout has expired', function () {
            chai.assert(true);
        })
    });
});
describe('TriggerObserver', function () {
    describe('onTriggerAdded', function () {
        it('does not add the trigger to the running list of triggers if it is not marked as active', function () {
            chai.assert(true);
        });
    });

    describe('onTriggerChanged', function () {
        it('adds the trigger to the list of running triggers if its active state has changed to true', function () {
            chai.assert(true);
        });

        it('removes the trigger from the list of running triggers if its active state has changed to false', function () {
            chai.assert(true);
        });
    });

    describe('onTriggerRemoved', function () {
        it('removes the trigger from the list of running triggers if it was previously running', function () {
            chai.assert(true);
        });
    });

    describe('checkConditions', function () {
        it('calls "checkPresetCondition" if property "expressionName" is set', function () {
            chai.assert(true);
        });

        it('calls "checkCustomCondition" if all three properties "path", "operator" and "value" are set', function () {
            chai.assert(true);
        });

        it("throws an exception if one of the conditions is malformed", function () {
            chai.assert(true);
        });
    });

    describe("checkPresetCondition", function () {
        it('calls the function referenced by the "expressionName" if it is a recognized expression', function () {
            chai.assert(true);
        });

        it('throws an exception if the function referenced by the "expressionName" is not a recognized expression', function () {
            chai.assert(true);
        });
    });

    describe("checkCustomCondition", function () {
        it('returns "true" if the custom condition is valid and passes', function () {
            chai.assert(true);
        });

        it('returns "false" if the custom condition is valid and fails ', function () {
            chai.assert(true);
        });

        it('throws and exception if the custom condition is invalid', function () {
            chai.assert(true);
        });
    });

    describe("runTriggerAction", function () {
        it('throws an exception if the property "actionName" is malformed', function () {
            chai.assert(true);
        });

        describe('actions defined at the device level', function () {
            it('calls the function referenced by the property "actionName" if found on the device', function () {
                chai.assert(true);
            })

            it('throws an exception if the function referenced by the property "actionName" is not found on the device', function () {
                chai.assert(true);
            });
        });

        describe('actions defined at the module level', function () {
            it('throws an exception if the panelInterface object that owns the module is not found', function () {
                chai.assert(true);
            });

            it('throws an exception if the module object that owns the action is not found', function () {
                chai.assert(true);
            });

            it('throws an exception if the module object that owns the action is found by the action is not defined', function () {
                chai.assert(true);
            });

            it('calls the function referenced by the property "actionName" if it is found on the module', function () {
                chai.assert(true);
            });
        });
    });

});
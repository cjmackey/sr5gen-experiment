'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
    beforeEach(module('myApp.controllers'));
    
    describe('CharacterCtrl', function() {
        it("initializes data", inject(function() {
            var scope = {};
            var ctrl = characterCtrl(scope);
            expect(scope.metatype_choices).toBeTruthy();
            expect(scope.metatype_choices.length).toBeGreaterThan(4);
        }));
    });
    
    it('should ....', inject(function() {
        //spec body
    }));
    
    it('should ....', inject(function() {
        //spec body
    }));
});

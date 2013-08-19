'use strict';

describe('Array', function(){
    describe('#equals', function(){
        it('is true for equal numbers', function(){
            expect([1,2,3].equals([1,2,3])).toBeTruthy();
        });
        it('is false for unequal numbers', function(){
            expect([1,2,3].equals([1,3,3])).toBeFalsy();
        });
        it('can be true with recursion', function(){
            expect([[1,2],3].equals([[1,2],3])).toBeTruthy();
        });
        it('can be false with recursion', function(){
            expect([[1,2],3].equals([[1,3],3])).toBeFalsy();
        });
        describe('dealing with objects of different types', function(){
            it('is false for arrays and numbers', function(){
                expect([[1,2],3].equals([1,3])).toBeFalsy();
            });
        });
    });
});

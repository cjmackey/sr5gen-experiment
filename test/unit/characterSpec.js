'use strict';

describe('Character', function(){
    it('can choose metatype', function(){
        var ch = new Character();
        expect(ch.metatype()).toBe(null);
        ch.choose_metatype(new MetatypePriorityChoice('E', Metatype.human, 1));
        expect(ch.metatype()).toBeTruthy();
        expect(ch.metatype().name).toEqual('Human');
    });
});
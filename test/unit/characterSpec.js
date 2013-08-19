'use strict';

describe('Character', function(){
    
    function metatype() { return Metatype.human; }
    function metatype_choice() {
        return new MetatypePriorityChoice('E', metatype(), 1);
    }
    function character() {
        var c = new Character();
        c.name = 'some name';
        c.choose_metatype(metatype_choice());
        return c;
    }
    
    it('can choose metatype', function(){
        var ch = new Character();
        expect(ch.metatype()).toBe(null);
        ch.choose_metatype(metatype_choice());
        expect(ch.metatype()).toEqual(metatype_choice().metatype);
    });
    
    it('measures attribute priority', function(){
        var ch = character();
        expect(ch.attributes_priority()).toBe('E');
        ch.attribute_point_allocation[3] = 19;
        expect(ch.attributes_priority()).toBe('B');
    });
    
    it('can be serialized', function(){
        var c1 = character();
        var o1 = c1.to_object();
        var j = JSON.stringify(o1)
        var o2 = JSON.parse(j)
        var c2 = Character.from_object(o2);
        expect(c1.equals(c2)).toBeTruthy();
    });
    
});

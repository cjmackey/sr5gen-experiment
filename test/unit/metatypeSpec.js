'use strict';

describe('Metatype', function(){
    
    it('has attributes', function(){
        expect(Metatype.human.attribute_mins[3]).toBe(1);
        expect(Metatype.human.attribute_mins[8]).toBe(2);
    });
    
    it('can be converted to/from generic object', function(){
        var m1 = Metatype.troll
        var o1 = m1.to_object();
        var j = JSON.stringify(o1)
        var o2 = JSON.parse(j)
        var m2 = Metatype.from_object(o2);
        expect(m1.equals(m2)).toBeTruthy();
        expect(m2.name).toEqual(m1.name);
        expect(m2.attribute_mins).toEqual(m1.attribute_mins);
        expect(m2.attribute_maxs).toEqual(m1.attribute_maxs);
    });
    
});

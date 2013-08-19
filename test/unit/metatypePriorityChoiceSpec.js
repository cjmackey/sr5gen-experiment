'use strict';

describe('MetatypePriorityChoice', function(){
    
    it('can be converted to/from generic object', function(){
        var p1 = new MetatypePriorityChoice('C', Metatype.ork, 7);
        var o1 = p1.to_object();
        var j = JSON.stringify(o1)
        var o2 = JSON.parse(j)
        var p2 = MetatypePriorityChoice.from_object(o2);
        expect(p1.equals(p2)).toBeTruthy();
        expect(p2.priority).toEqual('C');
        expect(p2.metatype.name).toEqual('Ork');
        expect(p2.points).toEqual(7);
    });
    
});

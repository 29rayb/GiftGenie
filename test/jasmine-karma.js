if (typeof NS == 'undefined') { NS = {}; };

NS.myfunction = {
  stuff: [],
  init: function init(){
    this.stuff.push('testing');
  },
  reset: function reset(){
    this.stuff = [];
  },
  append: function append(string1, string2){
    return string1 + ' ' + string2;
  }
};

NS.myfunction.init();

describe('myfunction', () => {
  var myfunc = NS.myfunction;
  it("should be able to append 2 strings", () => {
    expect(myfunc.append).toBeDefined();
  });
  it("should append 2 strings", () => {
      expect(myfunc.append('hello','world')).toEqual('hello world');
  });
})
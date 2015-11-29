describe('Transliterator', function(){
  beforeEach(function(done){
    var init = rules => {
      this.t = new Transliterator(rules);
    }

    var url = '../chatino-alphabet.json';
    
    fetch(url)
      .then(r => r.json())
      .then(init)
      .then(done)
      .catch(e => console.log(e))


  })

  describe('initializes', function(){

    it('inits', function(){
      expect(this.t).not.toBeNull();
    })

    it('has a transliterate method', function(){
      expect(this.t.transliterate).not.toBeNull();
    })
  })

  describe('Chatino rules', function(){
    beforeEach(function(){
      this.sample = `
le!e_
kee lira_
kya7a_ ke!ku_
ya ntzuti
lya_ta! yaa_7
serli_
nyate_& nu n-ch-u7u to laa
tzu!7na_
nku_-tzu!7
xi7na_ kii7
keto&7 ki_kwa!&
%-ata7
ti!kwi_
jlyani_
ki_kwa!& nu nti-ka jne_
ni7i n-tz-u7u n-tz-ukwa_7
nu nt-i-7ni=nta_wi!7 sapatu_
kwi!yu_7
ki_kwa!& nt-u_-sa_7a!& kwe_ya!7`
    })

    it('IPA[a] => PDLMA[a]', function(){
      expect(this.t.transliterate('ipa', 'PDLMA', 'a' )).toBe('a');
    })

    it('IPA[j] => PDLMA[y]', function(){
      expect(this.t.transliterate('ipa', 'PDLMA', 'j' )).toBe('y');
    })

    it('PDLMA[y] =>  practical[y]', function(){
      expect(this.t.transliterate('PDLMA', 'practical', 'y' )).toBe('y');
    })

    it('PDLMA[sh] =>  practical[x]', function(){
      expect(this.t.transliterate('PDLMA', 'practical', 'sh' )).toBe('x');
    })

    it('PDLMA[sh] =>  practical[x]', function(){
      expect(this.t.transliterate('PDLMA', 'practical', 'sh' )).toBe('x');
    })

    it('reversible PDLMA, practical', function(){
      var practical = this.t.transliterate('PDLMA', 'practical', this.sample );
      var PDLMA = this.t.transliterate('practical', 'PDLMA', practical );
      var practical2 = this.t.transliterate('PDLMA', 'practical', PDLMA );
      expect(practical).toEqual(practical2);
    })
   
  })


})

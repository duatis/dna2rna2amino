var starts	= ['AUG', 'GUG', 'UUG'], 
stops	= ['UAA', 'UAG', 'UGA']
aminos ={
	AUU:  "I", AUC: "I", AUA: "I",
	CUU: "L", CUC: "L", CUA: "L", CUG: "L", UUA: "L", UUG: "L",
	GUU: "V", GUC: "V", GUA: "V", GUG: "V",
	UUU: "F", UUC: "F",
	AUG: "M",
	UGU: "C", UGC: "C",
	GCU:"A", GCC:"A", GCA:"A", GCG:"A",
	GGU: "G", GGC: "G", GGA: "G", GGG: "G",
	CCU: "P", CCC: "P", CCA: "P", CCG: "P",
	ACU: "T", ACC: "T", ACA: "T", ACG: "T",
	UCU: "S", UCC: "S", UCA: "S", UCG: "S", AGU: "S", AGC: "S",
	UAU: "Y", UAC: "Y",
	UGG: "W",
	CAA: "Q", CAG: "Q",
	AAU: "N", AAC: "N",
	CAU: "H", CAC: "H",
	GAA: "E", GAG: "E",
	GAU: "D", GAC: "D",
	AAA: "K", AAG: "K",
	CGU: "R", CGC: "R", CGA: "R", CGG: "R", AGA: "R", AGG: "R",
	UAA: "<-", UAG: "<-", UGA: '<-'
}

module.exports = function(_DNA) {

	this.DNA		= _DNA,
	this.RNA 	= translate(this.DNA),
	this.DNAI	= inverse(this.DNA),
	this.RNAI 	= translate(this.DNAI),
	
	getDNA  = function(){
		return this.DNA
	}

	getDNAI  = function(){
		return this.DNAI
	}

	getRNA  = function(){
		return this.RNA
	}

	getRNAI  = function(){
		return this.RNAI
	}

	getStarts = function(string)
	{
		findStarts( this[string] )
	}

	getStops = function(string)
	{
		findStops( this[string] )
	}

	reload = function(){
		this.DNA		= _DNA,
		this.RNA 	= translate(this.DNA),
		this.DNAI	= inverse(this.DNA),
		this.RNAI 	= translate(this.DNAI)
	}

	cut  = function( string, start, end )
	{
		return this[string] = this[string].split('').splice(start, end-start).join('')
	}

	splitCodons = function(string)
	{
		return codons(this[string])
	}

	amino = function(string)
	{
		var codons = string.split('*'), result = '->'
		for( var i = 1; i< codons.length; i++ )
		{
			result += aminos[codons[i]]
		}
		console.log(result)
	}

	orf = function(string)
	{
		console.log( getOrf(this[string]) )		
	}

	translate2amino = function(string)
	{
		var orfs = getOrf(this[string]), cut 
		for( var i in orfs )
		{
			console.log('Start: ' + orfs[i].start + ', Stop: ' + orfs[i].stop)
			console.log('ORF: ' + orfs[i].orf )
			this.amino( codons(orfs[i].orf) )
		}
	}

	return this;
}


function codons(RNA)
{
	var _RNA = ''
	RNA = RNA.split('')
	for( var i = 0; i < RNA.length; i++ )
	{
		if( i%3 == 0 && i>0 ) _RNA +='*'
		_RNA += RNA[i]
	}
	return _RNA
}

function getOrf( dna )
{
	var rna = translate(dna),
	starts = findStarts(rna),
	stops  = findStops(rna),
	orf = []

	for( var start in starts )
	{
		for( var stop in stops ){
			if( (stops[stop]-starts[start])%3 == 0 &&  (stops[stop]-starts[start] > 3) && starts[start] < stops[stop]){
				cut = rna.split('').splice(starts[start], (stops[stop]+3)-starts[start]).join('')
				orf.push({start: starts[start],stop:stops[stop], orf: cut})
			}
		}
	}

	if(orf.length<2) return orf;	

	for( var i = 0; i < orf.length; i++ )
	{
		for( var j = 0; j < orf.length; j++ )
		{
			if( j == i ||  !( orf[i].start && orf[j].start ) ) continue;
			if( orf[i].start >= orf[j].start &&  orf[i].stop <= orf[j].stop )orf[i].start = false;
		}
	}
	return orf.filter(function(item){ return item.start })
}

function translate( _DNA )
{
	var _RNA = ''
	_DNA.split('').forEach(function(nucleotid){

		switch( nucleotid )
		{
			case 'T':
				_RNA += 'A';
				break;
			case 'C':
				_RNA += 'G';
				break;
			case 'G':
				_RNA += 'C';
				break;
			case 'A':
				_RNA += 'U';
				break;	
		}

	});
	return _RNA;
}


function inverse( _DNA )
{
	var _DNAI = '';
	_DNA.split('').forEach(function(nucleotid){

		switch( nucleotid )
		{
			case 'T':
				_DNAI += 'A';
				break;
			case 'C':
				_DNAI += 'G';
				break;
			case 'G':
				_DNAI += 'C';
				break;
			case 'A':
				_DNAI += 'T';
				break;	
		}

	});
	return _DNAI;
}

function findStarts( RNA )
{
	var _starts = []
	starts.forEach( function(codon){
		index = RNA.indexOf(codon)
		while( index >= 0 )
		{
			_starts.push(index)
			index = RNA.indexOf(codon, index+3)
		}
	} )
	return _starts
}


function findStops( RNA )
{
	var _stops = []
	stops.forEach( function(codon){
		index = RNA.indexOf(codon)
		while( index >= 0 )
		{
			_stops.push(index)
			index = RNA.indexOf(codon, index+3)
		}
	} )

	return _stops
}

// RNA = translate(DNA)
// DNAI = inverse(DNA)
// RNAI = translate(DNAI)


// console.log('DNA: ' + DNA)
// console.log('RNA: ' + (RNA))

// console.log('Starts')
// findStarts(RNA)
// console.log('stops')
// findStops(RNA)

// console.log('DNAI: ' + DNAI)
// console.log('RNAI: ' + (RNAI) )
// console.log('RNA: ' + RNA)

// console.log('Starts')
// findStarts(RNAI)
// console.log('stops')
// findStops(RNAI)
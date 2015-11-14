var dna2rna2amino 
var fs  = require('fs')

  fs.readFile('dna', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
  }
  dna2rna2amino = require('./dna2rna2amino.js')(data)


  var program = require('commander');

  program
    .version('1.0.0')
    .usage('action [options] <values ...>')
   
   program
     .command('dna')
     .option('-i, --inverse', 'Use inverse DNA string.' )
     .description('Show DNA string')
     .action(function() {
      if(this.inverse)
        console.log( dna2rna2amino.getDNAI())
      else
        console.log( dna2rna2amino.getDNA())
   });

  program
       .command('rna')
       .option('-i, --inverse', 'Use inverse RNA string.')
       .description('Show inverse RNA string')
       .action(function() {
        if(this.inverse)
          console.log( dna2rna2amino.getRNAI())
        else
          console.log( dna2rna2amino.getRNA())
     });

   program
       .command('starts')
       .option('-i, --inverse', 'Show start codons from inverse RNA string' )
       .description('Show start codons inside string')
       .action(function() {
        if(this.inverse)
           dna2rna2amino.getStarts('RNAI')
        else
           dna2rna2amino.getStarts('RNA')
     });

    program
       .command('stops')
       .option('-i, --inverse', 'Use inverse RNA string.' )
       .description('Show stop codons inside string')
       .action(function() {
        if(this.inverse)
          dna2rna2amino.getStops('RNAI')
        else
          dna2rna2amino.getStops('RNA')
     });

      program
       .command('codons <start> <end>')
       .option('-i, --inverse', 'Use inverse RNA string.' )
       .option('-s, --save <file>', 'Save Result to file')
       .description('Show codons inside string separated by *. Start and end values define a part of the RNA secuence.')
       .action(function(start, end, file) {
        if(this.inverse)
          string = 'RNAI'
        else
          string = 'RNA'

          dna2rna2amino.cut(string, start, parseInt(end)+3)
          if(!this.save)
            console.log( dna2rna2amino.splitCodons(string))
          else
          {
            (function(file)
            {
              codon = dna2rna2amino.splitCodons(string)
              fs.writeFile(file, codon, function(err){
                if(err)throw err
                console.log("file " + file + ' created with result')
                console.log(codon)
              })
            })(this.save)
          }
     });

    program
       .command('amino <fil>')
       .description('Show aminoacids from a previously saved codon file')
       .action( function(file) {
        fs.readFile(file, 'utf8', function (err,data) {
              if (err) {
                return console.log(err);
              }
          dna2rna2amino.amino(data)
        });
     });

    
    program.parse(process.argv);
});






(function() {
// Expose
loggly.bark.external_command({
  range: {run: run}
})

// Implementation
function run(args, stdin, context) {
  alert(args)
}

function dateStr(d){
  function pad(n){return n<10 ? '0'+n : n}
  return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
//      + pad(d.getUTCSeconds())+'Z' // let loggly figure it out
}


}())

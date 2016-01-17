Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

function bitprint(u) {
    var s="";
    for (var n=0; u; ++n, u>>=1)
        if (u&1) s+=n+" ";
    return s;
}
function bitcount(u) {
    for (var n=0; u; ++n, u=u&(u-1));
    return n;
}
function comb(c,n) {
    var s=[];
    for (var u=0; u<1<<n; u++)
        if (bitcount(u)==c)
            s.push(bitprint(u))
    for (var i = 0; i < s.length; i++) {
        s[i] = s[i].trim().split(" ");
    }
    return s.sort();
}

function isPossibleToGetAllFollower(numWriter, pickWriter, readers, expected) {
    ccc = comb(pickWriter, numWriter);
    for (var i =0; i < ccc.length; i++) {
        output = [];
        ccc[i].forEach(function(item){
            output = output.concat(readers[item]);
            output = output.unique();
        });
        if (output.length == expected + 1) {
            return true;
        } else {
            continue;
        }
    }
}

function submit() {
    array = $('#problem').val().split('\n');
    nextWriter = 1;
    answer = [];
    for (var b = 1; b <= parseInt(array[0]); b++) {
        writerLine = nextWriter;
        curWriterLine = array[writerLine];
        wr = curWriterLine.split(" ");
        nextWriter = nextWriter + parseInt(wr[0]) + 1;
        readers = [];
        for (var x = 1; x <= parseInt(wr[0]); x++) {
            readers.push(array[writerLine + x].split(" "));
        }
        for (var x = 1; x <= parseInt(wr[0]); x++){
            if (isPossibleToGetAllFollower(parseInt(wr[0]), x, readers, parseInt(wr[1]))) {
                answer.push(x);
                break;
            }
        }
    }
    console.log(answer);
}
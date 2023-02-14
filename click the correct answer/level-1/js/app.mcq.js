var level = 0;
var arr1 = [];
var q_set = [];
var total_ques = 0;
var score = 0;
var sc = 0;
var selected_ques = 0;
var audio = new Audio();
var right = false;
var gameOver = false;
var newLevel = 0;
$(window).resize(showexplanation);

$(document).ready(function (e) {

    $('#app-title').html(MASTER_DB.CONFIG.TITLE);

    for (i = 0; i < MASTER_DB.QUESTIONS.length; i++) {
        var j = i + 1;
        arr1.push(MASTER_DB.QUESTIONS[i]);

        if (j % MASTER_DB.CONFIG.MAX_QUES_PER_SCREEN == 0) {
            q_set.push(arr1);
            arr1 = [];
        }
    }

    loadQuestion(0);

})

function showexplanation() {
    $('.explanation').css('top', ($('.content').position().top + $('.content').height()) - $('.explanation').height());
}



function loadQuestion(itr) {

    $('#current_screen').html(itr + 1);
    $('#total_screen').html(q_set.length - 1);
    right = false;
    $('.explanation').remove();
    $('.strips').removeClass('disabled');

    var total_que = q_set.length;
    var current_que = itr + 1;

    console.log(total_que);
    console.log(current_que);





    // if(total_que = )


    var str = '';

    for (i = 0; i < q_set[itr].length; i++) {
        var title = q_set[itr][i].title;
        var opts = q_set[itr][i].options;
        var j = i + 1;
        var k = 0;

        var start_title = String(title).substr(0, parseInt(String(title).indexOf('-')) + 2);
        var end_title = String(title).substr(parseInt(String(title).indexOf('-')) + 2, String(title).length);

        str += '<div class="questions" id="' + (itr + 1) + '"><div class="title-h4"><div class="ques"><span id = "s_no">' + start_title + '</span><span id = "_txt">' + end_title + '</span></div></div><div class="options"><div style="">';

        if (total_que == current_que) {

            str += '<p class="ans-bd"> </p>';
            // $('#content').css('display', 'none');
            $('#_txt').css("font-size", "45px");
            $('.activity1').css('display', 'none');
            $('.final').css('display', 'block');
                
            $('#vdo11').addClass('d-block');
            $('#vdo11').removeClass('d-none');
            setTimeout(function () {


                $('#vdo10').removeClass('d-block');
                $('#vdo10').addClass('d-none');

            }, 1500);

            setTimeout(function () { $('#music').attr("src", "audio/welldone_01.mp3"); }, 1000);
            setTimeout(function () { $('#music').attr("src", ""); }, 2500);

        }
        else {
            for (var key in opts) {
                k++;
                str += '<p style="font-size: 19px;"><span class="strips" onclick=checkvalues(this);> <label for="q' + (itr + 1) + '_' + k + '"> ' + key + ' </label><input type="radio" class="radio radio1 radio2" id="q' + (itr + 1) + '_' + k + '" name="q' + (itr + 1) + '" value="' + opts[key] + '" onclick=checkvalues(this); ></span></p>';
            }
            str += '</div>'
            if (q_set[itr][i].image != '') str += '<div class="imageBox"><img src=img/' + q_set[itr][i].image + '></img></div>';
        }

        str += '</div></div>';
        $('#content').html(str);
    }

    // hide next if not available
    // var nxtLevel = parseInt(itr) + 1;
    var chk = q_set[nxtLevel];
    if (chk == undefined) {
        $('#btnNext').hide();
    }
}

function checkvalues(evt) {
    if (gameOver) return;

    var index = $(evt).parent().index();

    var incorrect = true;
    $(".questions").each(function (index, element) {
        var id = $(this).attr('id');
        var radioValue = $("input[name='q" + id + "']:checked").val();
        if (radioValue == 'true') incorrect = false; 

    });

    if (!incorrect) {
        right = true;
        playAudio('right1.mp3');
        showFeedback('right', index);
        $(evt).parent().addClass('right_opt');
        sc++;

        // setTimeout(function () { 
        //     $('#vdo1').attr("src", "mango/right answer/2.m4v"); 
        // }, 2300);

        

        vn = sc / 2;
        var vdo = "#vdo" + vn;
        vn2 = vn+1;
        var vdo2 = "#vdo" + vn2;

        var vdow = "#vdo_w" + vn;

        $(vdo2).addClass('d-block');
        $(vdo2).removeClass('d-none');

        $(vdo).removeClass('d-block');
        $(vdo).addClass('d-none');

        $(vdow).addClass('d-none');
        $(vdow).removeClass('d-block');
        $(vdo2).play();

    } else {

        right = false;
        playAudio('wrong1.mp3');
        showFeedback('wrong', index);
        $('.strips').addClass('disabled');
        $(evt).parent().addClass('wrong_opt');

      

        vn_w = sc / 2;
        vn_wr = vn_w+1;
        
        var vdor = "#vdo" + vn_wr;

        var vdo_w = "#vdo_w" + vn_wr;
        $(vdo_w).addClass('d-block');
        $(vdo_w).removeClass('d-none');

        $(vdor).addClass('d-none');
        $(vdor).removeClass('d-block');

        $(vdo_w).play();

        
       

        // $('.right').addClass('d-none');
        // $('.right').removeClass('d-block');

        // $(vdo2).removeClass('d-block');
        // $(vdo2).addClass('d-none');
    }

    // setTimeout(function () { 
    //     $(vdo_w).addClass('d-none');
    //     $(vdo_w).removeClass('d-block');

    //     $(vdo2).removeClass('d-block');
    //     $(vdo2).addClass('d-none');

    //     $('#vdo1').removeClass('d-none');
    //     $('#vdo1').addClass('d-block');
    // }, 4000);


    // $('#current_screen').html(score);
    // var per = ((score / (q_set.length)) * 88);

    var per = (((level + 1) / q_set.length) * 78);
    last_pos = $('.flower').position().per;
    $('.butterfly').css({
        'position': 'absolute',
        'left': last_pos + '%'
    });
    $('.butterfly').animate({
        'left': per + '%',
        'aria-valuenow': per
    }, 1000);


    // $('.bee:last-child').fadeOut(800, function() {
    //     $('.bee:last-child').remove()
    // });
}

$('.dial')
    .val(50)
    .trigger('change');

function showFeedback(val, ind) {
    let _id = parseInt($(".questions").attr('id'));

    let txt = '';

    //console.log(Object.keys(q_set[_id-1][0].options)[ind]);
    /*if(val == 'right') 
    {
        txt = Object.keys(q_set[_id-1][0].options)[ind];
        hardTxt = "Answer";
        _class = 'inline';
    }
    else 
    {
        txt = q_set[_id-1][0].options[Object.keys(q_set[_id-1][0].options)[ind]];
        hardTxt = "Explanation";
        _class = '';
    }
	
    if($('.explanation').length) $('.explanation').remove();
	
    $('.container').prepend('<div class="explanation"><p class="head ' + _class +'">'+hardTxt+' : </p><p class='+_class+'>'+txt+'</p></div>')
    showexplanation();*/
}


function playAudio(audioname) {
    if (audio) audio.pause();

    $(audio).attr('src', 'audio/' + audioname);

    if (audioname.indexOf('.mp3') != -1) $(audio).attr('type', 'audio/mp3');
    else if (audioname.indexOf('.ogg') != -1) $(audio).attr('type', 'audio/ogg');

    audio.play();
    $(audio).on('ended', function () {
        $('.strips').removeClass('disabled');
        $('.strips').removeClass('wrong_opt');
        if (right) {
            var newLevel = parseInt(level) + 1;
            if (newLevel < q_set.length) {
                level = newLevel;
                loadQuestion(newLevel);
            } else {
                gameOver = true;
                $('.strips').addClass('no_pointer');

            }
        }
    })
}

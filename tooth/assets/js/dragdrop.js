var items;
var itemContainer;
var answers = false;
var _text;
var score = 0;
var _length = 0;
var right = 0;
var table_content = '';
var submissions = [];
var wattempt = 0;
$(window).resize(onresize);

$(document).ready(function(e) {
    items = MASTER_DB.OPTIONS;
    var container = "#container-box";
    itemContainer = "#container-items-box";
    var footerContainer = "#btn-wrapper-holder";
    var feedbackTracker;
    var lastDrag, lastDrop;

    _text = MASTER_DB.QUESTIONS;
    addquestions();
    init();
    $('#activity_title, title').html(MASTER_DB.CONFIG.TITLE);
    $("#app-instruction").html(MASTER_DB.CONFIG.INSTRUCTION);

    function init() {
        $(itemContainer).empty()

        $.each(items, function(index, value, ele) {
            for (var k = 1; k <= value.length; k++) {
                $('<div class="item"></div>')
                    .html(value[k - 1])
                    .appendTo(itemContainer);
            }
        });

        $(itemContainer).find('.item').each(function(index, element) {
            var i = Math.floor(Math.random() * items.length);
            $(itemContainer).find('.item').eq(i).detach().prependTo(itemContainer);
        });

        _length = $(itemContainer).children().length;

        //$('<div class="footer">').appendTo('.stage');

        $('.item').draggable({
            containment: ".body-container",
            revert: 'invalid',
            revertDuration: 600
        });
    }

    onresize();
});

function addquestions() {
    $('#current_screen').html(score + 1);
    $('#total_screen').html(items.length);
    table_content = '';
    for (var i = score; i < (score + 8); i++) {
        console.log(i);
        var str = "";
        var j = 0;
        var val = _text[i];
        var count = (val.match(/[<>]/g) || []).length;
        count = count / 2;

        for (var k = 1; k <= count; k++) {
            val = val.replace('[<>]', '<div class="addHere" id="' + (i + 1) + '_' + k + '"></div>');
        }
        table_content += "<li class='opt"+ (i + 1) +"'><div id = 'div_seq' >" + (i + 1) + ". </div><div id = 'div_parent'>" + val + "</div></li>";
    }

    $('#container-box > ol').html(table_content);

    let objj = new Object();

    $('.addHere').each(function() {
        var id = $(this).attr('id');
        var exp = id.split('_');
        var i = exp[0];
        var k = exp[1];
        cleanText = items[i - 1][k - 1].replace(/<\/?[^>]+(>|$)/g, "");
        $(this).html('<div class="drop" id="drop_' + id + '" data-ans = "' + cleanText + '"></div>');
    });

    $('.drop').droppable({
        accept: '.item',
        drop: function(event, ui) {
            var userAns = $(ui.draggable).html();
            var ans = $(event.target).attr('data-ans');
            // console.log('com');
            $("#feedback-incorrect, #feedback-correct").hide();
            lastDrag = $(ui.draggable);
            lastDrop = $(event.target);
            console.log(userAns, ans);

            if (userAns != ans) {


                objj[lastDrop.attr('id')]

                if (objj[lastDrop.attr('id')] == undefined) objj[lastDrop.attr('id')] = Number(0);
                objj[lastDrop.attr('id')] += Number(1);

                console.log(objj, lastDrop.attr('id'), ' shgdsd sghsd ');
                $(this).addClass('wrong_fill');
                //score++;
                // $('#reset').removeAttr('disabled');

                lastDrop.attr('data-drop', 'wrong_put');
                //$(ui.draggable).remove();

                $(ui.draggable).draggable('option', 'revert', true);

                if (objj[lastDrop.attr('id')] == 1) {
                    let _this = $(this);

                    _this.html($(ui.draggable).html());

                    setTimeout(function() {
                        _this.html('');
                        _this.removeClass('wrong_fill');
                    }, 500);
                }

                // showAnswers();
                // SecondAttempt();
                playAudio('wrong1');
                submissions.push(0);
                // $('#current_screen').html(score);

                // var per = ((score / (items.length)) * 90);

                // last_pos = $('.bone').position().per;
                // $('.dog').css({
                //     'position': 'absolute',
                //     'left': last_pos + '%'
                // });
                // $('.dog').animate({
                //     'left': per + '%',
                //     'aria-valuenow': per
                // }, 1000);
            } else {
                right++;
                $(this).removeClass('wrong_fill');
                $(this).addClass('right_fill');
                score++;
                submissions.push(1);
                playAudio('right1');
                //console.log(`Submissions: ${submissions}`);
                $('#reset').removeAttr('disabled');
                lastDrop.attr('data-drop', 'right_put');

                // $(ui.draggable).remove();
                $(ui.draggable).draggable('option', 'revert', false);
                $(this).droppable("disable");
                $(this).html($(ui.draggable).html());
                $('#current_screen').html(score);
                var per = ((score / (items.length)) * 90);
                console.log(score);
                console.log(_length);
            }

            checkemptyContainer();

            try {
                clearTimeout(feedbackTracker);
            } catch (err) {

            }
            feedbackTracker = setTimeout(function(e) {
                $("#feedback-incorrect, #feedback-correct").hide();
            }, MASTER_DB.CONFIG.FEEDBACK_TIME);
        }
    });
}

function SecondAttempt() {
    $('#drop_1_1').replace('drop_', '');

}

function onresize() {
    let Height = $('#container-items-box').outerHeight();
    $('#container-box ol').css('padding-top', (Height - 25));
}

function checkemptyContainer() {
    console.log("This function is running")
    if (score > 0 & score % 2 == 0 & score < _length) {
        console.log("I am adding questions");
        setTimeout(addquestions, 2000);
    } else if (score > 0 && score == _length) {
        console.log("Hello! I am here");
        setTimeout(function () {
            $('.main').remove();
            $('.last #last').removeClass('d-none').addClass('d-block');
            playAudio('well-done');
        }, 500);
        return 0;
    } else{
        console.log("This is else statement");
    }
}

function showAnswers() {
    answers = true;

    $('.drop').each(function(index, value) {
        var _ind = $(this).attr('id').replace('drop_', '');
        var ind = _ind.indexOf('_');
        var last_ind = Number(_ind.lastIndexOf('_')) + 1;

        var ques_id = Number(String(_ind).substring(0, ind));
        var option_id = Number(String(_ind).substring(last_ind, String(_ind).length));
        $('#drop_' + ques_id + '_' + (option_id)).html(items[ques_id - 1][option_id - 1]);
        $('#drop_' + ques_id + '_' + (option_id)).addClass("ans-correct").removeClass("ans-incorrect");
        // $('.item').remove();
    });

    // checkemptyContainer();

    // $("#answer").attr('disabled', 'disabled');
}

function replaceBlackToDrop(_txt, sNo) {
    var word = _txt.split(" ");
    var _string = "";

    var indNO = 0;
    for (var i = 0; i < word.length; i++) {
        _string += '<span class = "words">' + word[i] + '</span>';

        if (_string.indexOf("[<>]") != -1) {
            indNO++;
            var Dropable_ele = "<div class = 'drop' id = drop_" + sNo + "_" + indNO + " data-ans = " + items[sNo - 1][indNO - 1] + "></div>";
            _string = _string.replace("[<>]", Dropable_ele);
        }
    }

    return _string;
}

function playAudio(file_name) {
    var _audio = new Audio('assets/audio/' + file_name + '.mp3');
    $(_audio).attr('type', 'audio/mp3');
    _audio.play();
}
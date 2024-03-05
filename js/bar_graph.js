$(document).ready(function () {
    // Check if there is any data in the local storage.
    if (localStorage.getItem('journalData')) {
        const journalData = JSON.parse(localStorage.getItem('journalData'));
        $('#Journal_container').html(journalData);
    }

    $('.report_answer').each(function () {
        const id = $(this).attr('id');
        if (localStorage.getItem(id)) {
            const value = localStorage.getItem(id);
            $(this).val(value);
        }
    })
});
// Set the date we're counting down to
var countDownDate;

if (localStorage.getItem('countDownDate')) {
    countDownDate = localStorage.getItem('countDownDate');
} else {
    countDownDate = new Date().getTime() + 35 * 60 * 1000;
}

// Update the count down every 1 second
var x = setInterval(function () {

    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for hours, minutes and seconds
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    // Pad the minutes and seconds with leading zeros if they are less than 10.
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');
    // Display the result in the element with id="count_down"
    document.getElementById("count_down").innerHTML = minutes + ":" + seconds;

    // If the count down is finished, write some text
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("count_down").innerHTML = "Time's Up";
    } else {
        // Store countdown date to localStorage
        localStorage.setItem('countDownDate', countDownDate);
    }
}, 1000);


$(function () {
    // Make elements with class 'draggable' draggable
    $(".draggable").draggable({

        helper: function () {
            return $(this).clone().css("z-index", 1000).appendTo('body');
        },
        revert: 'invalid',

    });

});

$(function () {
    $(".input_answer, .report_input").droppable({
        accept: ".draggable, .sortable",
        drop: function (event, ui) {
            let totalValue = ui.helper.text();
            let dataTitle = ui.helper.attr('data-title');
            let otherTitle = ui.helper.attr('title');
            // get the value by replacing the data-title from totalValue
            let value = totalValue.replace(dataTitle, '').replace('X', '').replace(/[^0-9.%]/g, '').trim();
            if (value.includes("%")) {
                // Replace % with an empty string, convert to number and divide by 100
                value = Number(value.replace("%", "")) / 100;
            }
            $(this).val(value);
            updateChart();
        }
    });
})
$(".journal_container").droppable({
    accept: ".draggable , .sortable",
    tolerance: "pointer",
    drop: function (event, ui) {
        if (ui.draggable.hasClass('draggable')) {
            var newElem = $(ui.helper).clone(false);
            newElem.removeClass('ui-draggable ui-draggable-handle ui-draggable-dragging').css({ 'position': 'relative', 'left': '', 'top': '' });
            // Add a title to the new element
            newElem.removeClass('draggable');
            newElem.addClass('sortable')
            newElem.prepend("<div class='title' contenteditable='true'>" + 'Calculator Result' + "</div>");
            // Add a horizontal line after the new element
            newElem.appendTo(this);
            newElem.append("<button class='remove'>X</button>");
            var wrapper = $('<div class="journal_container">').append(newElem, "<hr>");
            wrapper.appendTo(this);
            $(this).sortable().removeClass('ui-draggable ui-draggable-handle');
            // your droppable-tile code
        }
        else if (ui.draggable.hasClass('sortable')) {
            var newElem = $(ui.draggable);
            newElem.removeClass('ui-draggable ui-draggable-handle').css({ 'position': 'relative', 'left': '', 'top': '' });
            newElem.next('hr').remove();
            // newElem.appendTo(this);
            newElem.appendTo(this);
            // Make the 'right_screen' container sortable
        }
    }
    // log the dropped element 
});
$('#Journal_container').sortable({
    cancel: '.title',
    cursorAt: { left: 15 },
    helper: 'clone',
    start: function (event, ui) {
        ui.helper.find('.title').hide();
        ui.helper.css('width', 'fit-content');
        ui.helper.css('height', 'fit-content');

    },
    stop: function (event, ui) {
        ui.item.find('.title').show();
    }
});

$('.calculator-btn').click(function () {
    const value = $(this).data('value');
    if (value === "AC") { // Clear the input field when 'AC' is clicked
        $('#inputField').val('');
    } else if (value === "C") { // Remove the last character when 'C' is clicked
        $('#inputField').val($('#inputField').val().slice(0, -1));
    } else if (value === "=") { // Evaluate the expression when '=' is clicked
        try {
            const expression = $('#inputField').val();
            const result = eval(expression);
            if (isNaN(result)) {
                alert('Invalid Expression');
            } else {
                $('#inputField').val(result);
                $('#result').text(result);
            }
        } catch (error) {
            alert('Invalid Expression');
        }
    } else {
        $('#inputField').val($('#inputField').val() + value);
    }
});
function showConfirmBox() {
    const journalData = $('#Journal_container').html();
    localStorage.setItem('journalData', JSON.stringify(journalData));
    document.getElementById("overlay").hidden = false;
    $('.report_input').each(function () {
        const id = $(this).attr('id');
        const value = $(this).val();
        localStorage.setItem(id, value);
    });
}


function closeConfirmBox() {
    document.getElementById("overlay").hidden = true;
}

function isConfirm(answer) {
    if (answer) {
        alert("Answer is yes");
    } else {
        closeConfirmBox();
    }
}

var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Y1', 'Y2','Y3', 'Y4', 'Y5'],
        datasets: [{
            label: 'Rendang Island',
            data: [356, 355, 312,261,0],  // Default values
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1
        },
        {
            label: 'Nangi Island',
            data: [215, 199,191,173,0],  // Default values
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }
    ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            y: {
                beginAtZero: true
            }
        },

        legend: {
            position: 'right',  // moves the legend to the right
            labels: {
                fontSize: 20  // change this to whatever size you want
            }
        }
    }
});
$(document).on('click', '.remove', function () {
    $(this).parent().next('hr').remove();
    $(this).closest('div').remove();
});

function updateChart() {
    // var value1 = document.getElementById('6. Graph - Revok Forest Worst-case').value || 356;
    // var value2 = document.getElementById('6. Graph - Langker Pasture Worst-case').value || 215;
    // var value3 = document.getElementById('6. Graph - Revok Forest Standard').value || 355;
    // var value4 = document.getElementById('6. Graph - Langker Pasture Standard').value || 199;
    // var value5 = document.getElementById('6. Graph - Revok Forest Worst-case').value || 312;
    // var value6 = document.getElementById('6. Graph - Langker Pasture Worst-case').value || 191;
    // var value7 = document.getElementById('6. Graph - Revok Forest Standard').value || 261;
    // var value8 = document.getElementById('6. Graph - Langker Pasture Standard').value || 173;
    var value1 = document.getElementById('6. Graph - Rendang Island Y5').value || 0;
    var value2 = document.getElementById('6. Graph - Nangi Island Y5').value || 0;

    myChart.data.datasets[0].data = [356, 355, 312, 261, value1];
    myChart.data.datasets[1].data = [215, 199,191,173,value2];
    myChart.update();
}


// Add input event listeners to all input fields
document.getElementById('6. Graph - Rendang Island Y5').addEventListener('input', updateChart);
document.getElementById('6. Graph - Nangi Island Y5').addEventListener('input', updateChart);
// document.getElementById('6. Graph - Revok Forest Standard').addEventListener('input', updateChart);
// document.getElementById('6. Graph - Langker Pasture Standard').addEventListener('input', updateChart);

document.getElementById('clearStorage').addEventListener('click', function () {
    // Temporarily store isLoggedIn
    var isLoggedIn = localStorage.getItem('isLoggedIn');

    // Clear all items from local storage
    localStorage.clear();

    // Restore isLoggedIn
    localStorage.setItem('isLoggedIn', isLoggedIn);
    // Refresh the page
    window.location.href = "index.html";
});
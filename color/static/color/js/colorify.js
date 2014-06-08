
/* We define here some referenced colors used */

/* Border color */
var border_color = new Array(0x34, 0x49, 0x5e);
/* Initial color */
var base_color = new Array(0xbd, 0xc3, 0xc7);
/* Coloration color */
var propag_color = new Array(0x34, 0x98, 0xdb);


var color_to_string = function(color) {
    return "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
}


/*  
    Get coordinates of a cell 
    @return    array of length two containing x and y 
 */
var coordinates = function(cell) {
    /* 
        Get the id of the cell split
        The id is of the form x-y
    */
    id = cell.attr('id').split("-");
    /* Parse int from the strings */
    row = parseInt(id[0]);
    col = parseInt(id[1]);
    /* Return an array containing the two coordinates */
    return new Array(row, col);
}

/* 
   Get a cell from its coordinates
   @return  jQuery selector on the cell at (i, j) 
*/
var cell_at = function(x, y) {
    return $(".square#" + x + "-" + y);
}

/* 
    Color the cell with the r, g, b values given in parameter
*/
var rgb = function(cell, r, g, b) {
    cell.css("background-color", color_to_string([r, g, b]));
    //"rgb(" + r + ", " + g + ", " + b + ")");
};

var deltar = 1;
var deltag = 1;
var deltab = 1;
/* 
    Propagation of the color by diffusion algorithm
    Color all the neighbors of the cell given in parameter
*/
var propagate = function(row, col, pair, r, g, b) {
        /* Getting the cell from its coordinates */
        cell = cell_at(row, col);

        /* If cell does not exist (happens when we are out of the map) */
        if (cell.length == 0) return;

        /* If the cell is already colored, do nothing */
        if (cell.css("background-color") != color_to_string(base_color)) {
            return;
        }

        /* Color the cell with the colors given in parameter v*/
        rgb(cell, r, g, b);

        pair = !pair;

        /* Recursive call on all the neighbors for the propagation */
        setTimeout(function() {
                
            /* Propagation to the north */
            propagate(row-1, col, pair, r + deltar, g + deltag, b + deltab);
            /* Propagation to the south */
            propagate(row+1, col, pair, r + deltar, g + deltag, b + deltab);
            /* Propagation to the west */
            propagate(row, col-1, pair, r + deltar, g + deltag, b + deltab);
            /* Propagation to the east */
            propagate(row, col+1, pair, r + deltar, g + deltag, b + deltab);

            /* Every other time, we also propagate in the four other directions */
            if (pair) {
                /* Propagation to the north-west */
                propagate(row-1, col-1, pair, r + deltar, g + deltag, b + deltab);        
                /* Propagation to the north-east */
                propagate(row-1, col+1, pair, r + deltar, g + deltag, b + deltab);        
                /* Propagation to the south-west */
                propagate(row+1, col-1, pair, r + deltar, g + deltag, b + deltab);        
                /* Propagation to the south-east */
                propagate(row+1, col+1, pair, r + deltar, g + deltag, b + deltab);        
            }
        /* Delay of 500ms between rounds of coloration to give the impression
        of physical propagation */
        }, 500);
        return;
}

/*
   Draw a border from two points 
*/
var draw_line = function(start, stop) {
    /* Getting coordinates of the two points */
    start_coord = coordinates(start);
    stop_coord = coordinates(stop);

    /* Direction of the draw, depending on the relative position of the two points */
    dirx = (start_coord[0] < stop_coord[0])?(+1):(-1);
    diry = (start_coord[1] < stop_coord[1])?(+1):(-1);

    /* Coordinates of the current point being drawn
       This points starts at starting_point and iterates
       until reaching stoping_point */
    senti_coord = new Array(start_coord[0], start_coord[1]);

    /* Coloration of the starting point */
    rgb(start, border_color[0], border_color[1], border_color[2]);

    /* Coloration of the points horizontally until senti is on the same column that the ending-point */
    while (senti_coord[0] != stop_coord[0]) {
        console.log(senti_coord);
        senti_coord[0] += dirx;
        rgb(cell_at(senti_coord[0], senti_coord[1]), border_color[0], border_color[1], border_color[2]);
    }

    /* Now coloration vertically until reaching the ending point */
    while (senti_coord[1] != stop_coord[1]) {
        console.log(senti_coord);
        senti_coord[1] += diry;
        rgb(cell_at(senti_coord[0], senti_coord[1]), border_color[0], border_color[1], border_color[2]);
    }
}

/*
    Recoloration of all cells to the original color.
    The borders are not affected by this function
*/
var clean_mess = function() {
    /* Iteration on each square */
    $(".square").each(function() {
        /* If this square is not a border */
        if ($( this ).css("background-color") != color_to_string(border_color)) {
            /* Let's colorate it with the original color */
            rgb($( this ), base_color[0], base_color[1], base_color[2]);
        }
    });
}

/*
    Clean the borders. All other cells are not affected
*/
var clean_borders = function() {
    /* Iteration on each square */
    $(".square").each(function() {
        /* If this square is a border */
        if ($( this ).css("background-color") == color_to_string(border_color)) {
            /* Let's colorate it with the original color */
            rgb($( this ), base_color[0], base_color[1], base_color[2]);
        }
    });
}


/* Mapping buttons to their functions */
$("#clean-btn").click(clean_mess);
$("#clean-borders-btn").click(clean_borders);


/* Listening on the radio buttons */
/* This is to know if we are or not in edition mod. It is used
   to change the color of the square hovered depending on the case */
$("input:radio[name=edition-rb]:radio").change(function() {
    /* At each change of state, we must check whether we are or not in the edition mod */
    if ($("input:radio[name=edition-rb]:checked").val() == 1) {
        /* If not, let's remove the edition class */
        $("#color-area").removeClass("edition");
    } else {
        /* If yes, let's add the edition class */
        $("#color-area").addClass("edition");
    }
});


/* This is a save of the last point clicked if we are in "draw line" mod */
var starting_point = null;

/* Listening on clicks on squares */
$(".square").click(function() {
    /* Check the mod */
    switch ($("input:radio[name=edition-rb]:checked").val()) {
        /* If edition mod is OFF */
        case "1":
            /* Remove the class "not-started" to disable the :hover coloration during the propagation */
            $("#color-area").removeClass("not-started");
            /* Get the coordinates of the starting cell */
            coord = coordinates($( this ));
            /* Get the delta from the UI sliders */

            /* Variation of the R composant during the propagation */
            deltar = $("#deltar").slider("option").value;
            /* Variation of the G composant during the propagation */
            deltag = $("#deltag").slider("option").value;
            /* Variation of the B composant during the propagation */
            deltab = $("#deltab").slider("option").value;

            /* Run the propagation alrogithm */
            propagate(coord[0], coord[1], true, propag_color[0], propag_color[1], propag_color[2]);
            /* Restaure the class "not-started" */
            $("#color-area").addClass("not-started");
            break;
        /* If edition point by point */
        case "2":
            /* If the cell clicked is a border ... */
            if ($( this ).css("background-color") == color_to_string(border_color)) {
                /* ... we remove the border */
                rgb($( this ), base_color[0], base_color[1], base_color[2]);
            /* Else */
            } else {
                /* It becomes a border */
                rgb($( this ), border_color[0], border_color[1], border_color[2]);
            }
            break;
        /* If draw line is ON */
        case "3":
            /* If starting point is null, it means that this is the first of two points to be clicked */
            if (starting_point == null) {
                /* Let's colorate this point */
                rgb($( this ), border_color[0], border_color[1], border_color[2]);
                /* And save it for drawing the line when we have the second point */
                starting_point = $( this );
            /* Else, it is time to draw the line */
            } else {
                draw_line(starting_point, $( this ));
                /* Reinitialisation of the first point for future drawing */
                starting_point = null;
            }
            break;
    }

});

/* Initialitatoin of the sliders */
var initSlider = function(slider) {
    if (slider.length > 0) {
          slider.slider({
                  min: 1,
                  max: 13,
                  value: 7,
                  orientation: "horizontal",
                  range: "min"
                }).addSliderSegments(slider.slider("option").max);
    }
}


$("body").ready(function() {
    initSlider($("#deltar"));
    initSlider($("#deltag"));
    initSlider($("#deltab"));

    $(':radio').radio();
});



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
    cell.css("color", "rgb(" + r + ", " + g + ", " + b + ")");
};

/* Original color composants of the squares on the map */
var or_r = 189;
var or_g = 195;
var or_b = 199;
/* Original color of the squares on the map as a string */
var original_color = "rgb(" + or_r + ", " + or_g + ", " + or_b + ")";


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
        if (cell.css("color") != original_color) {
            return;
        }

        /* Color the cell with the colors given in parameter v*/
        rgb(cell, r, g, b);

        pair = !pair;

        /* Recursive call on all the neighbors for the propagation */
        setTimeout(function() {
                
            /* Variation of the R composant during the propagation */
            deltar = 3;
            /* Variation of the G composant during the propagation */
            deltag = 3;
            /* Variation of the B composant during the propagation */
            deltab = 3;

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


var draw_line = function(start, stop) {
    start_coord = coordinates(start);
    stop_coord = coordinates(stop);

    dirx = (start_coord[0] < stop_coord[0])?(+1):(-1);
    diry = (start_coord[1] < stop_coord[1])?(+1):(-1);

    senti_coord = new Array(start_coord[0], start_coord[1]);

    console.log(start_coord);
    console.log(stop_coord);
    console.log(senti_coord);

    rgb(start, 0, 0, 0);
    while (senti_coord[0] != stop_coord[0]) {
        console.log(senti_coord);
        senti_coord[0] += dirx;
        rgb(cell_at(senti_coord[0], senti_coord[1]), 0, 0, 0);
    }
    while (senti_coord[1] != stop_coord[1]) {
        console.log(senti_coord);
        senti_coord[1] += diry;
        rgb(cell_at(senti_coord[0], senti_coord[1]), 0, 0, 0);
    }
}

var clean_mess = function() {
    $(".square").each(function() {
        if ($( this ).css("color") != "rgb(0, 0, 0)") {
            rgb($( this ), or_r, or_g, or_b);
        }
    });
}

var clean_borders = function() {
    $(".square").each(function() {
        if ($( this ).css("color") == "rgb(0, 0, 0)") {
            rgb($( this ), or_r, or_g, or_b);
        }
    });
}

var starting_point = null;

$("#clean-btn").click(clean_mess);
$("#clean-borders-btn").click(clean_borders);

$(".square").click(function() {
    switch ($("input:radio[name=edition-rb]:checked").val()) {
        case "1":
            coord = coordinates($( this ));
            propagate(coord[0], coord[1], true, 0x34, 0x98, 0xdb);
            break;
        case "2":
            if ($( this ).css("color") == "rgb(0, 0, 0)") {
                rgb($( this ), or_r, or_g, or_b);
            } else {
                rgb($( this ), 0, 0, 0);
            }
            break;
        case "3":
            console.log("Draw line.");
            if (starting_point == null) {
                starting_point = $( this );
            } else {
                draw_line(starting_point, $( this ));
                starting_point = null;
            }
            break;
    }

});


$(':radio').radio();

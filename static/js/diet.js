$(document).ready(function () {
    $(".query").submit("click", function (event) {
        event.preventDefault();
        $(".results").children().remove();
        $(".nutritional-container").children().remove();
        var userQuery = ($("input[name='tags']").val()).replace(/[\s-+(),.]/g, " ");
        searchApiWith(userQuery);
    });
});

// User key for API access
var ndbKey = "gA9qgMluHacPOMK4aLSaZP87vYT3Sobd5Sqt7bH6";


// Start a new search
function searchApiWith(userQuery) {

    var parameters = {
        format: 'json',
        q: userQuery,
        api_key: ndbKey
    };
    // Get food names and foodIds
    var result = $.ajax({
        url: "https://api.data.gov/usda/ndb/search/",
        data: parameters,
        type: "GET"
    }).done(function (result) {
        $(".nutritionList-container").children().remove()
        var searchResults = result.list.item,
            multiTagsArray = $.each(userQuery.split(/[\s]/), function (index, item) {
            });

//			console.log(result);

        reviewSearchResults(searchResults, multiTagsArray)

        // When a food item is selected a second API search is completed
        // to retreive its nutritional-container information using the items foodId

        $(".results li").on("click", function () {
            var foodId = $(this).attr("data-id");
            $(this).clone(false).appendTo($(".queryresults ul"));
            $(".results").append("<ul id='querylist' style='padding-top:10px; list-style-type: none;padding-inline-start: 10px;' class='food-list'></ul>");
            $(".querylist-result").append("<input name='amount' type='text'>")
            getNutritionalInformation(foodId);
        });


    })
        .fail(function (e, x, thrownError) {
            if (thrownError == "Not Found") {
                showError();
            }
        });
};


// If only 1 tag was input by the user
// then print results whose primary tag matches the user input tag
// E.g. A search for "potato" would not print "Snacks, potato chips..."
// Else produce results that are refined based on all user input tags
// E.g. A search for "raw potato" would print all results with "raw" and "potato" as part of its name
function reviewSearchResults(searchResults, multiTagsArray) {
    var domToBeSetUp = true,
        relevantResults = 0;
    if (multiTagsArray.length === 1) {
        var singleTag = multiTagsArray[0];
        printSearchResults(domToBeSetUp, relevantResults, searchResults, singleTag);
    } else {
        refineSearchResults(domToBeSetUp, relevantResults, searchResults, multiTagsArray);
    }
    ;
}

function printSearchResults(domToBeSetUp, relevantResults, searchResults, singleTag) {
    $.each(searchResults, function (index, searchValue) {
        checkCaseInArray(singleTag, searchValue);
        if (tagLower == 0 || tagUpper == 0) {
            checkForFoodList(domToBeSetUp);
            domToBeSetUp = false;
            printResult(searchValue);
            relevantResults++;
        }
        ;
    });
    checkRelevantResults(relevantResults);
}

function refineSearchResults(domToBeSetUp, relevantResults, searchResults, multiTagsArray) {
    $.each(searchResults, function (index, searchValue) {
        var thisResultRelevance = 0,
            resultNamesArray =
                $.each((searchValue.name)
                    .replace(/,/g, "")
                    .split(" "), function (index, item) {
                });

        // Counts how many user input tags are in each result
        $.each(multiTagsArray, function (index, tagValue) {
            checkCaseInArray(tagValue, searchValue);
            if (tagLower >= 0 || tagUpper >= 0) {
                thisResultRelevance++;
            }
            ;
        });

        // If the result is relevant based on all user input tags then it gets printed
        if (thisResultRelevance === multiTagsArray.length) {
            // Set up the DOM when first relevant result is found
            checkForFoodList(domToBeSetUp);
            domToBeSetUp = false;
            printResult(searchValue);
            relevantResults++;
        }
        ;
    });
    checkRelevantResults(relevantResults);
};

// Check if the DOM is ready to be populated with food items
function checkForFoodList(domToBeSetUp) {
    if (domToBeSetUp) {
        setUpDomToPrint();
    }
    ;
}

// If no relevant results were found present error
function checkRelevantResults(relevantResults) {
    if (relevantResults === 0) {
        showError();
    }
    ;
}


var resultList = []

function getNutritionalInformation(foodId) {
    $(".nutritional-container").children().remove();
    var parameters = {
        format: 'json',
        ndbno: foodId,
        api_key: ndbKey
    };
    var result = $.ajax({
        url: "https://api.data.gov/usda/ndb/reports/",
        data: parameters,
        type: "GET"
    }).done(function (result) {
        createNutritionList(result);
        // $('.nutritional-container').append(nutritionalInformation);
        // console.log(result.report);
    });
}


// Create a copy of the template nutrition list
// and append it under nutritional-container information
function createNutritionList(result) {
    // Create a temporary copy of the template
    var temp = $(".templates .nutrition").clone();
    var path = result.report.food;
    var nutrPath = path.nutrients;

    // Search to API object by index.name rather than index
    var lookup = {};
    for (var i = 0, len = nutrPath.length; i < len; i++) {
        // lookup[nutrPath[i].name.replace(/[\s-+(),.]/g, "")] = nutrPath[i];
        lookup[nutrPath[i].nutrient_id] = nutrPath[i];
    }
    resultList.push(lookup)
    // console.log(lookup)
    // Prints the wanted search results into the temporary DOM's elements
    // updateNutrListElement(".calories", lookup[208], temp);
    // updateNutrListElement(".fat", lookup[204], temp);
    // updateNutrListElement(".saturated", lookup[606], temp);
    // updateNutrListElement(".fiber", lookup[291], temp);
    //updateNutrListElement(".water", lookup[255], temp);
    // updateNutrListElement(".zinc", lookup[309], temp);
    // updateNutrListElement(".iron", lookup[303], temp);
    // updateNutrListElement(".folate", lookup[435], temp);
    // updateNutrListElement(".protein", lookup[203], temp);
    // updateNutrListElement(".sugars", lookup[269], temp);
    // updateNutrListElement(".calcium", lookup[301], temp);
    // updateNutrListElement(".phosphorus", lookup[305], temp);
    // updateNutrListElement(".vitamin_A", lookup[318], temp);
    // updateNutrListElement(".vitamin_B6", lookup[415], temp);
    // updateNutrListElement(".vitamin_B12", lookup[418], temp);
    // updateNutrListElement(".vitamin_C", lookup[401], temp);
    // temp.find(".food").text(path.name);
    // temp.find(".carbohydrate").text(
    //     (+lookup[205].value -
    //         +lookup[291].value).toFixed(1) +
    //     lookup[205].unit
    // );
    return temp
//	Print all nutritional information in the console
//	$.each(nutrPath, function(index, nutrValue) {
//		console.log(nutrValue.name + ": " + nutrValue.value + nutrValue.unit);
//	});
}

var protein = 0
var sugars = 0
var calcium = 0
var phosphorus = 0
var vitamin_A = 0
var vitamin_B6 = 0
var vitamin_B12 = 0
var vitamin_C = 0
var vitamin_D = 0

var Amount
var calculation = []

$("#calculate").click(function () {

    if ($(".querylist-result li").length) {
        $(".querylist li").each(function () {
            var foodId = $(this).attr("data-id");
            getNutritionalInformation(foodId);
        });
        Amount = $("input[name='amount']")

        for (var i = 0; i < Amount.length; i++) {
            console.log(Amount[i].value)
        }

        console.log(resultList)

        for (var i = 0; i < resultList.length; i++) {
            var validation = 0
            if (resultList[i][203] == null) {
                protein += validation
            } else {
                protein += parseFloat(Amount[i].value / 100) * parseFloat(resultList[i][203].value)
            }
            if (resultList[i][269] == null) {
                sugars += validation
            } else {
                sugars += parseFloat(Amount[i].value / 100) * parseFloat(resultList[i][269].value)
            }
            if (resultList[i][301] == null) {
                calcium += validation
            } else {
                calcium += parseFloat(Amount[i].value / 100) * parseFloat(resultList[i][301].value)
            }
            if (resultList[i][305] == null) {
                phosphorus += validation
            } else {
                phosphorus += parseFloat(Amount[i].value / 100) * parseFloat(resultList[i][305].value)
            }
            if (resultList[i][318] == null) {
                vitamin_A += validation
            } else {
                vitamin_A += parseFloat(Amount[i].value / 100) * parseFloat(resultList[i][318].value)
            }
            if (resultList[i][415] == null) {
                vitamin_B6 += validation
            } else {
                vitamin_B6 += parseFloat(Amount[i].value / 100) * parseFloat(resultList[i][415].value)
            }
            if (resultList[i][418] == null) {
                vitamin_B12 += validation
            } else {
                vitamin_B12 += parseFloat(Amount[i].value / 100) * parseFloat(resultList[i][418].value)
            }
            if (resultList[i][401] == null) {
                vitamin_C += validation
            } else {
                vitamin_C += parseFloat(Amount[i].value / 100) * parseFloat(resultList[i][401].value)
            }
            if (resultList[i][328] == null) {
                vitamin_D += validation
            } else {
                vitamin_D += parseFloat(Amount[i].value / 100) * parseFloat(resultList[i][401].value)
            }
        }


        calculation.push(sugars)
        calculation.push(protein)
        calculation.push(calcium)
        calculation.push(phosphorus)
        calculation.push(vitamin_A)
        calculation.push(vitamin_B6)
        calculation.push(vitamin_B12)
        calculation.push(vitamin_C)
        calculation.push(vitamin_D)
    }

    $("#information").css('display', 'block')
    protein = 0
    sugars = 0
    calcium = 0
    phosphorus = 0
    vitamin_A = 0
    vitamin_B6 = 0
    vitamin_B12 = 0
    vitamin_C = 0
});


$("#clear").click(function () {
    resultList = []
    $("#querylist").children().remove()
    $(".nInfo-name li").each(function () {
        $(this).text('')
    })
    $(".gInfo-name li").each(function () {
        $(this).text('')
    })
    $(".querylist-result").children().remove()
    $("#information").css('display', 'none');

})

// Create a new results list and provide secondary instruction
function setUpDomToPrint() {
    $(".results").append("<ul id='querylist' style='padding-top:10px; list-style-type: none;padding-inline-start: 10px;' class='food-list'></ul>");
    $(".nutritionList-container").append("<div class='instruction' style='padding-top: 15px;'><p>Click on a food item to display its nutritional information.</p></div>");
}

// Mitigate first letter capitalisation for user input tags
function checkCaseInArray(tag, value) {
    tagLower = value.name.indexOf(tag.charAt(0).toLowerCase() + tag.slice(1));
    tagUpper = value.name.indexOf(tag.charAt(0).toUpperCase() + tag.slice(1));
};

// Print food items found in first search along with their ndbno (data-id)
function printResult(searchValue) {
    $(".food-list").append("<li class='foodItem' data-id='" + searchValue.ndbno + "'>" + searchValue.name + "</li>");
};

// Place the nutritional value and unit inside the temporary element for the DOM
// function updateNutrListElement(element, nutrient, temp) {
//     var nutrLevel = +nutrient.value
//     temp.find(element).text(nutrLevel.toFixed(1) + nutrient.unit);
// };

// Provides error feedback if no results were found
function showError() {
    $(".results").append($('.templates .error').clone());
};


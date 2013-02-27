/**
 * Node.js Access Log callbacks.
 *
 * @todo Instead of looping over all charts on page, should use CSS IDs.
 * @todo It would be really cool if the charts didn't flash as they were
 *       re-rendered, meh.
 */
(function($) {
  Drupal.Nodejs.callbacks.nodejs_accesslog = {
    callback: function(message) {

      // Switch on channel and ignore messages that might have broadcast => TRUE
      switch(message.channel) {
      case 'nodejs_accesslog':

	// We'll go through each chart on this page
	$('.visualization-chart').each(function() {

	  // Chart var and flags we'll use
	  var chart = Drupal.settings.visualization[$(this).attr('id')];
	  var found, map, map_found = false;

	  // Walk through all chart data rows
	  $.each(chart.dataArray, function(index, element) {

	    // This is for the linechart's grouping by period
	    if(element[0] == message.data.period) {
	      found = true;
	      // Increment because it already exists
	      chart.dataArray[index][1] = 1 + element[1];
	    }

	    // We know we're on the map at this point, now check if this point already exists
	    if(map && element[0] == Math.floor(message.data.country.latitude) && element[1] == Math.floor(message.data.country.longitude)) {
	      map_found = true;
	      // Increment because it already exists
	      element[2] = 1 + element[2];
	    }

	    // Simple way of determining we're on the map
	    if(element[0] == 'Latitude') {
	      map = true;
	    }
	  });

	  // If there weren't any current requests in this perdiod, add a new row
	  if(!found && !map) {
	    chart.dataArray.push([message.data.period, 1]);
	  }

	  // Same with the map, if applicable
	  if(map && !map_found) {
	    chart.dataArray.push([Math.floor(message.data.country.latitude), Math.floor(message.data.country.longitude), 1]);
	  }

	  // Format the data as Google prefers
	  var data = google.visualization.arrayToDataTable(chart.dataArray);

	  // Stolen from the visualization module (because there's no behavior to modify chart data after it's been rendered)
          if (data.getNumberOfRows() == 0) {
            var emptyRow = [];

            for (i = 0; i < data.getNumberOfColumns(); i ++) {
              if (i > 0) {
                data.z[i]['type'] = 'number';
                emptyRow.push(0);
              } else {
                emptyRow.push('');
              }
            }
            data.addRow(emptyRow);
          }

	  // Render chart
	  Drupal.visualization.charts[$(this).attr('id')].draw(data, chart.options);
	});

	// Get the table body
	var tableBody = $('#nodejs_accesslog-table tbody');

	// Figure out the zebra class
	var rowClass = tableBody.find('tr').first().hasClass('odd') ? 'even' : 'odd';

	// Compile new row
	var row = $('<tr></tr>').addClass(rowClass).html('<td>' + [message.data.access, message.data.period, message.data.user].join('</td><td>') + '</td>');

	// Add it
	tableBody.prepend(row);

	break;
      }
    }
  };
}) (jQuery);
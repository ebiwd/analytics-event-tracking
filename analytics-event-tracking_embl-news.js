// Custom analytics tracking for news.embl.de
// This code tracks the user's clicks in various parts of the EBI site and logs them as GA events.
// Links in non-generic regions can be tracked by adding '.track-with-analytics-events' to a parent div. Careful with the scoping.
//
// Support contact: Ken Hawkins (khawkins@ebi.ac.uk)

var trackerName = ''; // As news.embl.de uses Google Tag Manager, we will need to prefix ga('send') 

// Utility method to get the last item in an array
if (!Array.prototype.last){
  Array.prototype.last = function() {
    return this[this.length - 1];
  };
};

// Dispatch the event to the GA function for recording
function analyticsTrackInteraction(actedOnItem, parentContainer) {
  var linkName = jQuery(actedOnItem).text().toString();

  // if there's no text, it's probably and image...
  if (linkName.length == 0 && jQuery(actedOnItem).attr('src')) linkName = jQuery(actedOnItem).attr('src').split('/').last();
  if (linkName.length == 0 && jQuery(actedOnItem).val()) linkName = jQuery(actedOnItem).val();

  ga(trackerName+'send', 'event', 'UI', 'UI Element / ' + parentContainer, linkName);
}

// Only track these areas
// This could be done more efficently with a general capture of links,
// but we're running against the page's unload -- so we need speed over elegance.
function activateTrackers() {

  // get the google tag manager name, probably something like "gtm1"
  trackerName = ga.getAll()[0].get('name') + '.'; 
  
  // these are the areas we intend to track on news.embl.de

  // Content areas
  // ------
  // content header => #page-header (it's a confusing ID, but yes it's page content specific)
  // content actions => .entry-actions-buttons
  // content => .entry-content-wrapper
  // content footer => footer.entry-meta
  
  // Site areas
  // ------
  // site main hearder => #main-header
  // site logo header => #logo-container
  // sidebar => #sidebar
  // site footer => footer.site-footer  


  jQuery("body.google-analytics-loaded #page-header").on( 'mousedown', 'a', function(e) {
    analyticsTrackInteraction(e.target,'Content header');
  });
  jQuery("body.google-analytics-loaded .entry-actions-buttons").on( 'mousedown', 'a', function(e) {
    analyticsTrackInteraction(e.target,'Content actions');
  });
  jQuery("body.google-analytics-loaded .entry-content-wrapper").on( 'mousedown', 'a', function(e) {
    analyticsTrackInteraction(e.target,'Content');
  });
  jQuery("body.google-analytics-loaded footer.entry-meta").on( 'mousedown', 'a', function(e) {
    analyticsTrackInteraction(e.target,'Content footer');
  });

  jQuery("body.google-analytics-loaded #main-header").on( 'mousedown', 'a', function(e) {
    analyticsTrackInteraction(e.target,'Site main hearder');
  });
  jQuery("body.google-analytics-loaded #logo-container").on( 'mousedown', 'a', function(e) {
    analyticsTrackInteraction(e.target,'Site logo header');
  });
  jQuery("body.google-analytics-loaded #sidebar").on( 'mousedown', 'a', function(e) {
    analyticsTrackInteraction(e.target,'Site sidebar');
  });
  jQuery("body.google-analytics-loaded footer.site-footer").on( 'mousedown', 'a', function(e) {
    analyticsTrackInteraction(e.target,'Site footer');
  });

  jQuery("body.google-analytics-loaded .track-with-analytics-events a").on( 'mousedown', function(e) {
    analyticsTrackInteraction(e.target,'Manually tracked area');
  });

  // disabled but kept for reference
  // jQuery("body.google-analytics-loaded #local-search").on( 'mousedown', 'input', function(e) {
  //   analyticsTrackInteraction(e.target,'Local search');
  // });
  // jQuery("body.google-analytics-loaded #ebi_search").on( 'mousedown', 'input#search_submit', function(e) {
  //   analyticsTrackInteraction(e.target,'Homepage search');
  // });
}

// wait for GA to bootstrap
var checksDone = 0;
function checkIfAnalyticsLoaded() {
  if (typeof ga === 'function') {
     jQuery('body').addClass('google-analytics-loaded'); // Confirm GA is loaded, add a class if found
     activateTrackers(); // now activate the jQuery trackers
  } else {
    if (checksDone < 10) { setTimeout(function(){ checkIfAnalyticsLoaded(); }, 700);} // wait a bit and check again, but not more than 10 times
  }
  checksDone++;
}

// Bootstrap all the code above
checkIfAnalyticsLoaded();

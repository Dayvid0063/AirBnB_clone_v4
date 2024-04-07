$(() => {
  let checkedAmenities = [];
  const selectors = {
    amenitiesHeader: '.amenities > h4',
    amenityBox: '.amenities > .popover > ul > li > input[type="checkbox"]',
    amenityItem: '.amenities > .popover > ul > li'
  };

  function updateDisplay () {
    const body = checkedAmenities.map(obj => obj.name).join(', ');
    $(selectors.amenitiesHeader).html(
      checkedAmenities.length > 0 ? 'Checked Amenities: ' + body : '&nbsp;'
    );
  }

  $(selectors.amenityItem).on('mousedown', function (ev) {
    const checkbox = $(this).find('input[type="checkbox"]');
    checkbox.prop('checked', !checkbox.prop('checked')).change();
  });

  $(document).on('change', selectors.amenityBox, function (ev) {
    const amId = $(this).data('id');
    const amName = $(this).data('name');

    if ($(this).is(':checked')) {
      if (!checkedAmenities.find(obj => obj.id === amId)) {
        checkedAmenities.push({ id: amId, name: amName });
      }
    } else {
      checkedAmenities = checkedAmenities.filter(obj => obj.id !== amId);
    }

    updateDisplay();
  });

  function APIstats () {
    fetch('http://0.0.0.0:5001/api/v1/status/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Request failed');
        }
        return response.json();
      })
      .then(data => {
        if (data.status === 'OK') {
          $('#api_status').addClass('available');
        } else {
          $('#api_status').removeClass('available');
        }
      })
      .catch(error => {
        console.error('Request error:', error);
        $('#api_status').removeClass('available');
      });
  }

  APIstats();
});

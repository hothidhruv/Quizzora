// Create the chart
function chart(){
Highcharts.chart('container', {
  chart: {
    type: 'pie'
  },
  title: {
    text: 'Show All User Status',
    align: 'left'
  },
  subtitle: {
    text: 'Hear you can see all users like visted, active, deactive, register',
    align: 'left'
  },

  accessibility: {
    announceNewData: {
      enabled: true
    },
    point: {
      valueSuffix: '%'
    }
  },

  plotOptions: {
    series: {
      dataLabels: {
        enabled: true,
        format: '{point.name}: {point.y:.1f}%'
      }
    }
  },

  tooltip: {
    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
  },

  series: [
    {
      name: 'Users',
      colorByPoint: true,
      data: [
        {
          name: 'Visit users',
          y: 61.04,
          drilldown: 'Visit users'
        },
        {
          name: 'Register user',
          y: 9.47,
          drilldown: 'Register user'
        },
        {
          name: 'Active user',
          y: 9.32,
          drilldown: 'Active user'
        },
        {
          name: 'Daily active',
          y: 8.15,
          drilldown: 'Daily active'
        },
        {
          name: 'Other',
          y: 11.02,
          drilldown: null
        }
      ]
    }
  ],
});
}

function checkAdmin(){
  debugger
  var adminid = localStorage.getItem("adminid");
  if(adminid){
    chart();
  } else {
      location.href = "admin.html"
  }
}
function logoutAdmin() {
  localStorage.removeItem("adminid");
  location.href = "admin.html";
}

$(".js-open-modal").click(function () {
  $(".modalbox").addClass("visible");
});

$(".js-close-modal").click(function () {
  $(".modalbox").removeClass("visible");
});

$(document).click(function (event) {
  //if you click on anything except the modal itself or the "open modal" link, close the modal
  if (!$(event.target).closest(".modalbox,.js-open-modal").length) {
    $("body").find(".modalbox").removeClass("visible");
  }
});
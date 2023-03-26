let markerVisible = { A: false, B: false, C: false, D: false, F: false  }; 
                  
AFRAME.registerComponent('registerevents', {   
       init: function () {     
                var marker = this.el;      
                marker.addEventListener('markerFound', function() {       
                           console.log('markerFound', marker.id);
                            markerVisible[ marker.id ] = true; 
                 });     
                 marker.addEventListener('markerLost', function() {       
                            console.log('markerLost', marker.id);
                            markerVisible[ marker.id ] = false; 
                 });   
         } 
});

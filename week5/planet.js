<html>
     <head> 
           <script src="aframe/aframe.min.js"></script>
           <script type="text/javascript">
                   planet: const day = 24.0*60*60;  
                   AFRAME.registerComponent('planet', {   
                      schema: {     
                        name: {type: 'string', default: ""},      
                        dist: {type: 'number', default: 0},        
                        mass: {type: 'number', default: 0},        
                        T: {type: 'int', default: 0},     
                        v: {type: 'array', default: [0,0,0]},     
                        a: {type: 'array', default: [0,0,0]},      
                        pos: {type: 'array', default: [0,0,0]}    
                      },    
                     init: function () {     
                       this.data.T*=day;      
                       this.data.pos[0]=this.data.dist; 
                       this.el.setAttribute('position',this.data.dist/1e9+' 0 0');     
                       if(this.data.T!=0)      
                         this.data.v[1] = 2*Math.PI*this.data.dist/this.data.T; 39   } 
                   });
                
             </script>
     </head>
</html>

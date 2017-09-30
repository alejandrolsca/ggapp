module.exports = {
                    "labels":{
                        "pr-title":"Seleccíone el tipo de producto",
                        "pr-process":"Processo",
                        "pr-type":"Tipo",
                    },
                     "fields" : {
                        pr_processoptions : [
                            {"label":"Offset","value":"offset",types:[
                                {"label":"General","value":"general"},   
                                {"label":"Paginados","value":"paginated"},   
                                {"label":"Talonario","value":"counterfoil"},   
                            ]},
                            {"label":"Flexo","value":"flexo",types:[
                                {"label":"Etiquetas","value":"labels"},   
                                {"label":"Ribbons","value":"ribbons"}
                            ]},
                            {"label":"Plotter","value":"plotter",types:[
                                {"label":"Flexibles","value":"flexibles"},   
                                {"label":"Rigidos","value":"rigid"},   
                                {"label":"Banners","value":"banner"}
                            ]},
                            {"label":"Sellos","value":"stamps",types:[
                                {"label":"General","value":"general"}, 
                                {"label":"Cojin","value":"inkpad"},  
                                {"label":"Tinta","value":"ink"},   
                            ]},
                            {"label":"Serigrafía","value":"serigraphy",types:[
                                {"label":"General","value":"general"},
                                {"label":"Etiquetas","value":"labels"},   
                                {"label":"Señalización","value":"signage"},   
                                {"label":"Banners","value":"banners"}
                            ]},
                            {"label":"Laser","value":"laser",types:[
                                {"label":"Laser","value":"laser"},     
                            ]},
                        ]
                     }
                }
$(function(){
    var graphP = {
        elements: {
            nodes: [
                { data: { id: 'n0', content: 'Expense "A" $100' } },
                { data: { id: 'n1', content: 'Cost Reference Data' } },
                { data: { id: 'n2', content: 'Equity' } },
                { data: { id: 'n3', content: 'Fixed Income' } },
                { data: { id: 'n4', content: 'Alternative' } },
                { data: { id: 'n5', content: 'Vehicles: 1,2,3' } },
                { data: { id: 'n6', content: 'Vehicles: 1,2,3' } },
                { data: { id: 'n7', content: 'Vehicles: 1,2,3' } }
            ],
            edges: [
                { data: { source: 'n0', target: 'n1' }, classes: 'questionable' },
                { data: { source: 'n1', target: 'n2', label: '70%' } },
                { data: { source: 'n1', target: 'n3', label: '20%' } },
                { data: { source: 'n1', target: 'n4', label: '10%' } },
                { data: { source: 'n2', target: 'n5' } },
                { data: { source: 'n2', target: 'n5' } },
                { data: { source: 'n2', target: 'n5' } },
                { data: { source: 'n3', target: 'n6' } },
                { data: { source: 'n3', target: 'n6' } },
                { data: { source: 'n3', target: 'n6' } },
                { data: { source: 'n4', target: 'n7' } },
                { data: { source: 'n4', target: 'n7' } },
                { data: { source: 'n4', target: 'n7' } }
            ]
        },
    };



    Promise.all([ graphP ]).then(initCy);

    function initCy( then ){
        var loading = document.getElementById('loading');
        var expJson = then[0];
        // var styleJson = then[1];
        var elements = expJson.elements;

        loading.classList.add('loaded');

        var cy = window.cy = cytoscape({
            container: document.getElementById('cy'),
            layout: { 
                name: 'dagre',
                rankDir: 'LR',
                rankSep: 200 
            },
            ready: function(){
                window.cy = this;
            },
            style: [
            {
                selector: 'node',
                css: {
                    'shape': 'roundrectangle',
                    'content': 'data(content)',
                    'text-opacity': 0.5,
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'text-wrap': 'wrap',
                    'text-max-width': 130,
                    'background-opacity': 0.8,
                    'border-width': 1,
                    'width': 150,
                    'height': 100
                }
            },

            {
                selector: 'edge',
                css: {
                    'width': 4,
                    'target-arrow-shape': 'triangle',
                    'line-color': '#9dbaea',
                    'target-arrow-color': '#9dbaea',
                    'curve-style': 'bezier'
                }
            },

            {
                selector: 'edge.questionable',
                css: {
                    'line-style': 'dotted'
                }
            },

            // some style for the ext

            {
                selector: '.edgehandles-hover',
                css: {
                    'background-color': 'red'
                }
            },

            {
                selector: '.edgehandles-source',
                css: {
                    'border-width': 2,
                    'border-color': 'red'
                }
            },

            {
                selector: '.edgehandles-target',
                css: {
                    'border-width': 2,
                    'border-color': 'red'
                }
            },

            {
                selector: '.edgehandles-preview, .edgehandles-ghost-edge',
                css: {
                    'line-color': 'red',
                    'target-arrow-color': 'red',
                    'source-arrow-color': 'red'
                }
            }
        ],
            elements: elements,
            motionBlur: true,
            selectionType: 'single',
            autoselectify: true,
            boxSelectionEnabled: false
        });

        cy.edgehandles({
            toggleOffOnLeave: true
        });

        document.querySelector('#draw-on').addEventListener('click', function () {
            cy.edgehandles('drawon');
        });

        document.querySelector('#draw-off').addEventListener('click', function () {
            cy.edgehandles('drawoff');
        });

        bindRouters();
    }

    function mendData(){
        cy.startBatch();

        var nodes = cy.nodes();
        var bin = {};
        var metanames = [];

        cy.endBatch();
    }

    var persent;
    var $body = $('body');

    function connectNode( edge, node, valPercent ) {
        clear();
        $body.addClass('has-qtip');
        console.log('Node percent'+ valPercent);
    }

    function clear(){
        $body.removeClass('has-qtip');
        cy.elements().removeClass('button');
    }

    function bindRouters() {
        cy.nodes().qtip({
            content: {
                text: function(){
                    var $ctr = $('<div class="popupPercentInput"></div>');
                    // var $label = $('<label for="percent">Percent</label>');
                    var $input = $(`<div class="input-group">
                                        <span class="input-group-addon">$</span>
                                        <input id="iPercent" type="text" class="form-control" name="demo5" value="50">
                                        <div class="input-group-btn">
                                            <button type="button" class="btn btn-default">Submit</button>
                                        </div>
                                    </div>`);
                    // var $btn = $('<button id="submitPercent"  value=""></button>');
                    
                    $input.on('click', function(){
                        var nT = cy.$('.edgehandles-target');
                        var nS = cy.$('.edgehandles-source');
                        var edge = cy.$('.edgehandles-preview');
                        var valPercent = $('#iPercent').val();
                        connectNode( edge, nS, valPercent);
                    })

                    $ctr.append($input);

                    return $ctr;
                }
            },
            show: {
                event: 'cyedgehandles.complete',
                // solo: true
            },
            position: {
                my: 'top center',
                at: 'top center',
                adjust: {
                method: 'flip'
                }
            },
            style: {
                classes: 'qtip-bootstrap',
                tip: {
                width: 16,
                height: 8
                }
            }
        })
    }


})
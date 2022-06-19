const poke_list = document.querySelector('#poke_list ul');
const description = document.getElementById('description');
const gen_choice = document.querySelector('.menu select');

function printPokeStats (pokemon){
    Highcharts.chart('container', {

        chart: {
            backgroundColor: 'rgba(0, 0, 0, 0)',
            polar: true,
            type: 'line'
        },
    
        title: {
            text: '',            
        },
    
        pane: {
            size: '80%'
        },
    
        xAxis: {
            labels: {
                style: {
                   color: 'black',
                   fontSize : '1.3em'
                }
             },
            categories: [
                'PV',
                'Attaque',
                'Défense',
                'Att. spé.',
                'Déf. spé.',
                'Vitesse'
            ]
        },
    
        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0,
            max: 200
        },
    
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
                '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
    
        legend: {
            align: 'right',
            verticalAlign: 'middle',
            layout: 'vertical'
        },
            plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            },
            series: {
                color: '#806852'
            }
        },
    
        series: [{
            name: pokemon.frName,
            showInLegend: false,             
            data: [pokemon.stats[0].base_stat, pokemon.stats[1].base_stat, pokemon.stats[2].base_stat, pokemon.stats[3].base_stat, pokemon.stats[4].base_stat, pokemon.stats[5].base_stat]
    
        }],
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        align: 'center',
                        verticalAlign: 'bottom',
                        layout: 'horizontal'
                    },
                    pane: {
                        size: '70%'
                    }
                }
            }]
        }
    
    });
}

const printList = async (data) => {
    gen_choice.disabled = true;
    for (pokemon of data.data.results){
        let entry = document.createElement('li');
        let poke_frName;
        let poke_frDesc;
        await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${(pokemon.url).split('/')[6]}`).then(({data}) => {
            let cpt = 0;
            while(data.names[cpt].language.name != "fr") cpt ++;
            poke_frName = data.names[cpt].name;
            cpt = 0;
            while(data.flavor_text_entries[cpt].language.name != "fr") cpt ++;
            poke_frDesc = data.flavor_text_entries[cpt].flavor_text;
        });
        await axios.get(pokemon.url).then(({data}) => {
            data.frName = poke_frName;
            data.frDesc = poke_frDesc;
            let div1 = document.createElement('div');
            div1.innerText = poke_frName;
            entry.append(div1);
            let sprite = document.createElement('img');
            sprite.setAttribute('src', data.sprites.front_default);
            sprite.setAttribute('height', '96px');
            sprite.setAttribute('alt', data.id);
            sprite.addEventListener('click', (e) => {
                while (description.firstChild) description.removeChild(description.firstChild);
                let artwork = document.createElement('img');
                artwork.setAttribute('src', data.sprites.other['official-artwork'].front_default);
                artwork.setAttribute('height', '250px');
                description.append(artwork);
                let parag = document.createElement('p');
                parag.innerText = data.frDesc;
                description.append(parag);
                let figure = document.createElement('figure');
                figure.setAttribute('class', 'highcharts-figure');
                let figure_div = document.createElement('div');
                figure.setAttribute('id', 'container');
                description.append(figure);
                printPokeStats(data);
            });
            sprite.addEventListener('mouseover', () => {
                sprite.setAttribute('src', data.sprites.front_shiny);
            });
            sprite.addEventListener('mouseout', () => {
                sprite.setAttribute('src', data.sprites.front_default);
            });
            entry.append(sprite);
            poke_list.appendChild(entry);
        });
    }
    gen_choice.disabled = false;
}

gen_choice.addEventListener('change', async () => {
    let offset;
    let limit;
    while (poke_list.firstChild) await poke_list.removeChild(poke_list.firstChild);
    switch (gen_choice.value) {
        case 'Première':
            offset = 0;
            limit = 151;
            break;
        case 'Deuxième':
            offset = 151;
            limit = 100;
            break;
        case 'Troisième':
            offset = 251;
            limit = 135;
            break;
        case 'Quatrième':
            offset = 386;
            limit = 107;
            break;
        case 'Cinquième':
            offset = 494;
            limit = 155;
            break;
        case 'Sixième':
            offset = 649;
            limit = 72;
            break;
        case 'Septième':
            offset = 722;
            limit = 87;
            break;
        case 'Huitième':
            offset = 809;
            limit = 89;
            break;
    }
    await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`).then(printList);
});

axios.get(`https://pokeapi.co/api/v2/pokemon?limit=151`).then(printList);
import React from 'react';
import { connect } from 'react-redux';

import page from 'page';

import StackChart from '../../../../shared/js/components/StackChart';

import PageTitle from '../../../../shared/js/components/gironde.fr/PageTitle';
import SecundaryTitle from '../../../../shared/js/components/gironde.fr/SecundaryTitle';
import PrimaryCallToAction from '../../../../shared/js/components/gironde.fr/PrimaryCallToAction';
import Markdown from '../../../../shared/js/components/Markdown';
import {makeAmountString} from '../../../../shared/js/components/MoneyAmount';

import {aggregatedDocumentBudgetaireNodeTotal} from '../../../../shared/js/finance/AggregationDataStructures.js'

import {makePartition, makeElementById} from './FinanceElement';
import FocusDetail from '../FocusDetail';

import {urls, AGENTS_PICTO, CARBURANT_PICTO, ELECTRICITE_PICTO, CARTE_PRESENCE_HTML} from '../../constants/resources';

import colorClassById from '../../colorClassById';

export function FocusSol({
    year, partitionByYear, yearDetails, screenWidth, urls
}) {

    const years = partitionByYear.keySeq().toJS();

    // sort all partitions part according to the order in this year's partition
    let thisYearPartition = partitionByYear.get(year)
    thisYearPartition = thisYearPartition && thisYearPartition.sort((p1, p2) => p2.partAmount - p1.partAmount);
    const partitionIdsInOrder = thisYearPartition && thisYearPartition.map(p => p.contentId) || [];

    // reorder all partitions so they adhere to partitionIdsInOrder
    partitionByYear = partitionByYear.map(partition => {
        // indexOf inside a .map leads to O(n^2), but lists are 10 elements long max, so it's ok
        return partition && partition.sort((p1, p2) => partitionIdsInOrder.indexOf(p1.contentId) - partitionIdsInOrder.indexOf(p2.contentId))
    });

    const focusDetailsDenominator = yearDetails ? yearDetails['DF.6'] : NaN;

    return React.createElement('article', {className: 'focus presence'},
        React.createElement('section', {},
            React.createElement(PageTitle, {text: `Pr??sence du D??partement sur le territoire`}),
            React.createElement(Markdown, {},
                `La Gironde attire chaque ann??e **entre 18 000 et 20 000 nouveaux habitants**. Cet afflux est un v??ritable d??fi puisque plus d???habitants signifie ??galement plus de services publics ?? mettre en oeuvre. Le D??partement **accorde une attention particuli??re au maintien** de la qualit?? des services offerts ?? toutes les Girondines et tous les Girondins sur l???ensemble du territoire.`
            )
        ),

        React.createElement('section', {className: 'focus-map'},
            React.createElement(SecundaryTitle, {text: 'Carte de la pr??sence du d??partement en Gironde'}),
            React.createElement(Markdown, {},
                `Pu??ricultrices, travailleurs sociaux, agents d???exploitation et de voirie, adjoints techniques territoriaux des ??tablissements d???enseignement, juristes??? **6 914** agents exercent **125 m??tiers** dans **425 lieux de travail et d???accueil du public**. A chaque lieu sont associ??s des frais de structure (consommation ??nerg??tique, ??ventuellement loyer) g??r??s dans le cadre de la strat??gie patrimoniale d??partementale. Explorez la carte ci-dessous pour visualiser le d??tail de ces frais de fonctionnement.`
            ),
            React.createElement('iframe', {src: urls[CARTE_PRESENCE_HTML], sandbox: 'allow-scripts'})
        ),

        React.createElement('section', {},
            React.createElement(SecundaryTitle, {text: 'Les frais li??s ?? la pr??sence du D??partement sur le territoire'}),
            React.createElement(Markdown, {},
                `Parmi les frais de fonctionnement on trouve des charges de structure qui permettent le fonctionnement de la collectivit?? au quotidien et sur tout le territoire girondin.`
            ),
            React.createElement(StackChart, {
                WIDTH: screenWidth >= 800 + 80 ?
                    800 :
                    (screenWidth - 85 >= 600 ? screenWidth - 85 : (
                        screenWidth <= 600 ? screenWidth - 10 : 600
                    )),
                portrait: screenWidth <= 600,
                xs: years,
                ysByX: partitionByYear.map(partition => partition.map(part => part.partAmount)),
                onBrickClicked: (year, id) => { page(`#!/finance-details/${id}`); },
                legendItems: thisYearPartition && thisYearPartition.map(p => ({
                    id: p.contentId,
                    className: p.contentId,
                    url: p.url,
                    text: p.texts.label,
                    colorClassName: colorClassById.get(p.contentId)
                })).toArray(),
                yValueDisplay: makeAmountString
            }),
            React.createElement(PrimaryCallToAction, {href: '#!/finance-details/DF.6.1', text: `en savoir plus`})
        ),
        React.createElement('section', {},
            React.createElement(SecundaryTitle, {text: `D??tails des frais li??s ?? la pr??sence du D??partement sur le territoire`}),
            React.createElement(Markdown, {}, `Avec la crise sanitaire, une extr??me attention aux d??penses a ??t?? demand??e aux services, et un important travail de r??gulation a ??t?? men?? en 2020 afin de limiter les d??penses non essentielles`),
            React.createElement(FocusDetail, {

                className: 'buildings',

                title: 'Prestations de services',
                illustrationUrl: urls[ELECTRICITE_PICTO],
                amount: yearDetails ? yearDetails['DF.6.1.2'] : undefined,
                proportion: yearDetails ? yearDetails['DF.6.1.2']/focusDetailsDenominator : 1,
                text: `Le D??partement assure l???entretien et la r??paration des b??timents qu???il occupe ou utilise en qualit?? de locataire : il les ??quipe, les relie ?? internet ?? haut d??bit et les assure contre les risques. Ce poste est en baisse de 16% en 2020`,
                highlights: [
                    {
                        strong: '1,56 M???',
                        span: `locations immobili??res (-7.7%)`
                    },
                    {
                        strong: '0.74M???',
                        span: `entretien et de maintenance des b??timents (-4.5%)`
                    },
                    {
                        strong: '1,07M???',
                        span: `contrats d???assurance (+7%)`
                    }
                ],
                moreUrl: '#!/finance-details/DF.6.1.2'
            }),
            React.createElement(FocusDetail, {

                className: 'buildings',

                title: 'Achats et fournitures',
                illustrationUrl: urls[CARBURANT_PICTO],
                amount: yearDetails ? yearDetails['DF.6.1.1'] : undefined,
                proportion: yearDetails ? yearDetails['DF.6.1.1']/focusDetailsDenominator : 1,
                text: `Cela correspond par exemple au financement de la consommation ??lectrique des b??timents de la collectivit??, du carburant pour le d??placement des agents, de l???achat de mobilier, des d??penses de consommation d???eau ou de chauffage ou encore celle de ses v??hicules ??lectriques.`,
                highlights: [
                    {
                        strong: '1,6M???',
                        span: `frais d'electicit?? (+13%)`
                    },
                    {
                        strong: '0.4 M???',
                        span: `d??penses de carburant (-36%)`
                    },
                    {
                        strong: '0.38 M???',
                        span: `d??penses de fourniture (-14%)`
                    }
                    /*{
                        strong: '0.275 M???',
                        span: `d??penses d'entretien (-1.75%)`
                    }*/
                ],
                moreUrl: '#!/finance-details/DF.6.1.1'
            }),
            React.createElement(FocusDetail, {

                className: 'buildings',

                title: 'Frais divers',
                illustrationUrl: urls[AGENTS_PICTO],
                amount: yearDetails ? yearDetails['DF.6.1.3'] : undefined,
                proportion: yearDetails ? yearDetails['DF.6.1.3']/focusDetailsDenominator : 1,
                text: `Cela concerne en particulier les honoraires, le conseil, les frais de r??ception, les frais t??l??com, l???affranchissement, les services bancaires???`,
                highlights: [
                    {
                        strong: '0.8 M???',
                        span: `frais de nettoyage de locaux (-6.4%)`
                    },
                    {
                        strong: '0.7 M???',
                        span: `frais d???affranchissement (-6.1%)`
                    },
                    {
                        strong: '2.6 M???',
                        span: `frais de t??l??communications (-17.5%)`
                    }
                ],
                moreUrl: '#!/finance-details/DF.6.1.3'
            })
        )
    );
}


const displayedContentId = 'DF.6.1';

export default connect(
    state => {
        const { aggregationByYear, currentYear, textsById, screenWidth} = state;

        const partitionByYear = aggregationByYear.map(aggregated => {
            const elementById = makeElementById(aggregated);

            const yearElement = elementById.get(displayedContentId);

            return yearElement && yearElement.children && makePartition(yearElement, elementById.map(e => aggregatedDocumentBudgetaireNodeTotal(e)), textsById)
        });

        const elementById = aggregationByYear.get(currentYear) ? 
            makeElementById(aggregationByYear.get(currentYear)) : 
            undefined;

        const yearDetails = elementById ? {
            'DF.6': aggregatedDocumentBudgetaireNodeTotal(elementById.get('DF.6')),
            'DF.6.1.1': aggregatedDocumentBudgetaireNodeTotal(elementById.get('DF.6.1.1')),
            'DF.6.1.2': aggregatedDocumentBudgetaireNodeTotal(elementById.get('DF.6.1.2')),
            'DF.6.1.3': aggregatedDocumentBudgetaireNodeTotal(elementById.get('DF.6.1.3'))
        } : undefined;


        return {
            year: currentYear,
            yearDetails,
            partitionByYear,
            screenWidth,
            urls
        };
    },
    () => ({})
)(FocusSol);

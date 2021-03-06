import { Map as ImmutableMap } from "immutable";

import React from "react";
import { connect } from "react-redux";

import { sum } from "d3-array";

import {
    RF,
    RI,
    DF,
    DI,
    EXPENDITURES,
    REVENUE
} from "../../../../shared/js/finance/constants";


import { aggregatedDocumentBudgetaireNodeTotal } from '../../../../shared/js/finance/AggregationDataStructures.js'
import { flattenTree } from "../../../../shared/js/finance/visitHierarchical.js";

import PageTitle from "../../../../shared/js/components/gironde.fr/PageTitle";
import SecundaryTitle from "../../../../shared/js/components/gironde.fr/SecundaryTitle";
import DownloadSection from "../../../../shared/js/components/gironde.fr/DownloadSection";
import PrimaryCallToAction from "../../../../shared/js/components/gironde.fr/PrimaryCallToAction";

import Markdown from "../../../../shared/js/components/Markdown";
import MoneyAmount from "../../../../shared/js/components/MoneyAmount";

import { urls, ANIMATION_VIDEO } from "../../constants/resources";

import M52ByFonction from "../M52ByFonction";
import BudgetConstructionAnimation from "../BudgetConstructionAnimation";

const MAX_HEIGHT = 30;

export function TotalBudget({
    currentYear,
    totalById,
    m52Instruction,
    planDeCompte,
    labelsById,
    urls: {
        expenditures: expURL,
        revenue: revURL,
        rf,
        ri,
        df,
        di,
        byFonction,
        animationVideo
    },
    constructionAmounts,
    screenWidth
}) {
    const expenditures = totalById.get(EXPENDITURES);
    const revenue = totalById.get(REVENUE);

    const max = Math.max(expenditures, revenue);

    const expHeight = MAX_HEIGHT * (expenditures / max) + "em";
    const revHeight = MAX_HEIGHT * (revenue / max) + "em";

    const rfHeight = 100 * (totalById.get(RF) / revenue) + "%";
    const riHeight = 100 * (totalById.get(RI) / revenue) + "%";
    const diHeight = 100 * (totalById.get(DI) / expenditures) + "%";
    const dfHeight = 100 * (totalById.get(DF) / expenditures) + "%";

    return React.createElement(
        "article",
        { className: "explore-budget" },
        React.createElement(PageTitle, {
            text: `Exploration des comptes ${currentYear}`
        }),
        React.createElement(
            "section",
            {},
            React.createElement(
                Markdown,
                {},
                `L???ann??e 2020 a ??t?? une ann??e particuli??re ?? plusieurs ??gards :

?? Elle restera marqu??e par une crise sanitaire et ??conomique qui certes a affect?? le budget du D??partement mais conforte l???utilit?? de ses politiques publiques ?? l?????gard des plus vuln??rables et en faveur de l?????quilibre des territoires Cette crise a plac?? une nouvelle fois les d??partements au c??ur de l???action du fait de leurs comp??tences en mati??re sociales mais aussi leur r??le d???acteurs des solidarit??s humaines et territoriales

?? Elle est la derni??re ann??e de perception de la taxe sur le foncier des propri??t??s b??ties (TFPB), dernier levier fiscal que conservaient les d??partements

?? Elle aura vu la suspension du Pacte de Cahors pour 2020 au vu des d??penses exceptionnelles consid??rables engag??es par les d??partements pour combattre la crise sanitaire puis sociale. Le D??partement de la Gironde aura quant ?? lui obtenu gain de cause gr??ce au jugement rendu en toute fin d???ann??e par le tribunal administratif confirmant qu???il ??tait ??ligible ?? un taux prenant en compte sa dynamique d??mographique.

?? La crise sanitaire aura clairement d??montr?? et mis en exergue les effets pr??occupants de la d??-corr??lation entre la structure des d??penses et des recettes d??partementales qui, en temps de crise, aggravent l???effet de ciseau et menacent la stabilit?? du soutien aux territoires et aux plus fragiles. ?? Elle porte le dernier budget vot?? et ex??cut?? de la mandature `
            )
        ),

        React.createElement(
            "section",
            {},
            React.createElement(SecundaryTitle, {
                text: "Les grandes masses budg??taires du compte administratif"
            }),
            React.createElement(
                "div",
                { className: "viz" },
                React.createElement(
                    "div",
                    { className: "revenue" },
                    React.createElement(
                        "a",
                        { href: revURL },
                        React.createElement("h1", {}, "Recettes")
                    ),
                    React.createElement(
                        "div",
                        {},
                        React.createElement(
                            "div",
                            {
                                className: "areas",
                                style: { height: revHeight }
                            },
                            React.createElement(
                                "a",
                                {
                                    className: "rf",
                                    href: rf,
                                    style: { height: rfHeight }
                                },
                                React.createElement(
                                    "h2",
                                    {},
                                    "Recettes de fonctionnement"
                                ),
                                React.createElement(MoneyAmount, {
                                    amount: totalById.get(RF)
                                })
                            ),
                            React.createElement(
                                "a",
                                {
                                    className: "ri",
                                    href: ri,
                                    style: { height: riHeight }
                                },
                                React.createElement(
                                    "h2",
                                    {},
                                    "Recettes d'investissement"
                                ),
                                React.createElement(MoneyAmount, {
                                    amount: totalById.get(RI)
                                })
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "texts" },
                            React.createElement(MoneyAmount, {
                                amount: revenue
                            }),
                            React.createElement(PrimaryCallToAction, {
                                text: `Les recettes`,
                                href: revURL
                            })
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "expenditures" },
                    React.createElement(
                        "a",
                        { href: expURL },
                        React.createElement("h1", {}, "D??penses")
                    ),
                    React.createElement(
                        "div",
                        {},
                        React.createElement(
                            "div",
                            {
                                className: "areas",
                                style: { height: expHeight }
                            },
                            React.createElement(
                                "a",
                                {
                                    className: "df",
                                    href: df,
                                    style: { height: dfHeight }
                                },
                                React.createElement(
                                    "h2",
                                    {},
                                    "D??penses de fonctionnement"
                                ),
                                React.createElement(MoneyAmount, {
                                    amount: totalById.get(DF)
                                })
                            ),
                            React.createElement(
                                "a",
                                {
                                    className: "di",
                                    href: di,
                                    style: { height: diHeight }
                                },
                                React.createElement(
                                    "h2",
                                    {},
                                    "D??penses d'investissement"
                                ),
                                React.createElement(MoneyAmount, {
                                    amount: totalById.get(DI)
                                })
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "texts" },
                            React.createElement(MoneyAmount, {
                                amount: expenditures
                            }),
                            React.createElement(PrimaryCallToAction, {
                                text: `Les d??penses`,
                                href: expURL
                            })
                        )
                    )
                )
            ),
            React.createElement(
                Markdown,
                {},
                `Les chiffres ??tant issus du compte administratif, la diff??rence entre le montant des recettes et le montant des d??penses repr??sente l'exc??dent ou le d??ficit de l'exercice.`
            )
        ),
        React.createElement(
            "section",
            {},
            React.createElement(SecundaryTitle, {
                text: `Comprendre la construction d'un budget`
            }),
            React.createElement(
                Markdown,
                {},
                `Le budget pr??voit la r??partition des recettes et des d??penses sur un exercice. Il est compos?? de la section de fonctionnement et d???investissement. Contrairement ?? l???Etat, les D??partements, ont l???obligation d???adopter un budget ?? l?????quilibre. Toutefois, le compte administratif peut pr??senter sur l'exercice un r??sultat exc??dentaire ou d??ficitaire.`
            ),
            React.createElement(
                Markdown,
                {},
                `Dans un contexte particulie??rement contraint, la pre??servation de nos e??quilibres financiers constitue un de??fi stimulant. Alors comment s?????tablit notre budget ?`
            ),
            React.createElement(
                BudgetConstructionAnimation,
                Object.assign(
                    {
                        videoURL: screenWidth <= 1000 ? animationVideo : undefined
                    },
                    constructionAmounts
                )
            )
        ),
        React.createElement(
            "section",
            { className: "m52" },
            React.createElement(SecundaryTitle, {
                text: "Les comptes par fonction (norme M52)"
            }),
            m52Instruction
                ? React.createElement(M52ByFonction, {
                    m52Instruction,
                    planDeCompte,
                    urlByFonction: byFonction,
                    labelsById,
                    screenWidth
                })
                : undefined,
            React.createElement(DownloadSection, {
                title: `Donn??es brutes sur datalocale.fr`,
                items: [
                    {
                        text:
                            "Comptes administratifs du D??partement de la Gironde au format XML TOTEM",
                        url:
                            "https://www.datalocale.fr/dataset/comptes-administratifs-budget-principal-donnees-budgetaires-du-departement-de-la-gironde"
                    }
                ]
            })
        )
    );
}

export default connect(
    state => {
        const {
            docBudgByYear,
            aggregationByYear,
            planDeCompteByYear,
            currentYear,
            textsById,
            screenWidth
        } = state;

        const m52Instruction = docBudgByYear.get(currentYear);
        const aggregated = aggregationByYear.get(currentYear);
        const planDeCompte = planDeCompteByYear.get(currentYear)

        let totalById = new ImmutableMap();
        if (aggregated) {
            flattenTree(aggregated).forEach(aggNode => {
                totalById = totalById.set(aggNode.id, aggregatedDocumentBudgetaireNodeTotal(aggNode));
            });
        }

        return {
            currentYear,
            totalById,
            m52Instruction,
            planDeCompte,
            labelsById: textsById.map(texts => texts.label),
            // All of this is poorly hardcoded. TODO: code proper formulas based on what was transmitted by CD33
            constructionAmounts: aggregated ?
                {
                    DotationEtat: totalById.get("RF.5"),
                    Fiscalit??Directe: totalById.get("RF.1"),
                    Fiscalit??Indirecte: sum(
                        ["RF.2", "RF.3", "RF.4"].map(i => totalById.get(i))
                    ),
                    RecettesDiverses:
                        totalById.get("RF") -
                        sum(
                            ["RF.1", "RF.2", "RF.3", "RF.4", "RF.5"].map(i =>
                                totalById.get(i)
                            )
                        ),

                    Solidarit??: totalById.get("DF.1"),
                    Interventions: totalById.get("DF.3"),
                    D??pensesStructure:
                        totalById.get("DF") -
                        sum(["DF.1", "DF.3"].map(i => totalById.get(i))),

                    Emprunt: totalById.get("RI.EM"),
                    RIPropre: totalById.get("RI") - totalById.get("RI.EM"),

                    RemboursementEmprunt: totalById.get("DI.EM"),
                    Routes: totalById.get("DI.1.2"),
                    Colleges: totalById.get("DI.1.1"),
                    Amenagement:
                        totalById.get("DI.1.3") +
                        totalById.get("DI.1.4") +
                        totalById.get("DI.1.5"),
                    Subventions: totalById.get("DI.2")
                }
                : undefined,
            urls: {
                expenditures: "#!/finance-details/" + EXPENDITURES,
                revenue: "#!/finance-details/" + REVENUE,
                rf: "#!/finance-details/" + RF,
                ri: "#!/finance-details/" + RI,
                df: "#!/finance-details/" + DF,
                di: "#!/finance-details/" + DI,
                byFonction: {
                    "M52-DF-0": `#!/finance-details/M52-DF-0`,
                    "M52-DF-1": `#!/finance-details/M52-DF-1`,
                    "M52-DF-2": `#!/finance-details/M52-DF-2`,
                    "M52-DF-3": `#!/finance-details/M52-DF-3`,
                    "M52-DF-4": `#!/finance-details/M52-DF-4`,
                    "M52-DF-5": `#!/finance-details/M52-DF-5`,
                    "M52-DF-6": `#!/finance-details/M52-DF-6`,
                    "M52-DF-7": `#!/finance-details/M52-DF-7`,
                    "M52-DF-8": `#!/finance-details/M52-DF-8`,
                    "M52-DF-9": `#!/finance-details/M52-DF-9`,
                    "M52-DI-0": `#!/finance-details/M52-DI-0`,
                    "M52-DI-1": `#!/finance-details/M52-DI-1`,
                    "M52-DI-2": `#!/finance-details/M52-DI-2`,
                    "M52-DI-3": `#!/finance-details/M52-DI-3`,
                    "M52-DI-4": `#!/finance-details/M52-DI-4`,
                    "M52-DI-5": `#!/finance-details/M52-DI-5`,
                    "M52-DI-6": `#!/finance-details/M52-DI-6`,
                    "M52-DI-7": `#!/finance-details/M52-DI-7`,
                    "M52-DI-8": `#!/finance-details/M52-DI-8`,
                    "M52-DI-9": `#!/finance-details/M52-DI-9`
                },
                animationVideo: urls[ANIMATION_VIDEO]
            },
            screenWidth
        };
    },
    () => ({})
)(TotalBudget);

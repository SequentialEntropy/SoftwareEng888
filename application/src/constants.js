/**
 * constants.js - Defines the global constants that are used throughout the application 
 * 
 * @file Stores authentication token keys for local storage management 
 * @author Carina Jose 
 * @author Amreet Dhillon 
 * @version 1.0.0
 * @since 13-02-2025
 */

/** Key for storing the access token in local storage */
export const ACCESS_TOKEN = "access";

/** Key for storing the refresh token in local storage */
export const REFRESH_TOKEN = "refresh";

export const squares = [
    {id:  0, name: "Start"            , backgroundColor: "#3c3e4c", location: [ 0               ,  0                 ], leniency: 0       },
    {id:  1, name: "Birks Grange"     , backgroundColor: "#7f95d1", location: [50.73655640077589, -3.5426938147256894], leniency: 0.00719 }, 
    {id:  2, name: "East Park"        , backgroundColor: "#558564", location: [50.73774365237917, -3.5274479919029176], leniency: 0.01079 },
    {id:  3, name: "Peter Chalk"      , backgroundColor: "#7f2982", location: [50.73621570756194, -3.5360560850693217], leniency: 0.000269}, 
    {id:  4, name: "Forum"            , backgroundColor: "#ea526f", location: [50.73520737891607, -3.533907682035006 ], leniency: 0.000269},
    {id:  5, name: "Great Hall"       , backgroundColor: "#558564", location: [50.73541359764122, -3.534757953935785 ], leniency: 0.000269},
    {id:  6, name: "Reed Hall"        , backgroundColor: "#7f95d1", location: [50.73524081401744, -3.5374778520320156], leniency: 0.000269},
    {id:  7, name: "Harrison"         , backgroundColor: "#e98a15", location: [50.73773693957766, -3.5324168459325818], leniency: 0.000269},
    {id:  8, name: "Innovation Centre", backgroundColor: "#7f2982", location: [50.73840552463827, -3.5310835404302385], leniency: 0.000269},
    {id:  9, name: "INTO Building"    , backgroundColor: "#ea526f", location: [50.73608348132103, -3.53389156394202  ], leniency: 0.000269},
    {id: 10, name: "Streatham Court"  , backgroundColor: "#558564", location: [50.73659522401942, -3.535152102267711 ], leniency: 0.000269},
    {id: 11, name: "Hatherly"         , backgroundColor: "#7f95d1", location: [50.73400605799908, -3.5331780674581252], leniency: 0.000269},
    {id: 12, name: "Old Library"      , backgroundColor: "#e98a15", location: [50.73335507931347, -3.534012873488209 ], leniency: 0.000269},
    {id: 13, name: "Queens"           , backgroundColor: "#7f2982", location: [50.73399656520741, -3.535028372328278 ], leniency: 0.000269},
    {id: 14, name: "Amory"            , backgroundColor: "#ea526f", location: [50.73654094948761, -3.531638658536732 ], leniency: 0.000269},
    {id: 15, name: "Business School"  , backgroundColor: "#558564", location: [50.73549527834785, -3.5301086620942534], leniency: 0.000269},
]
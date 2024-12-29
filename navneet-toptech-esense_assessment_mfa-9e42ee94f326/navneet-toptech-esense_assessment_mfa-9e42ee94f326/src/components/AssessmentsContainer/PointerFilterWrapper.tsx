import * as React from 'react';
import { Grid, TextField, FormControl } from '@mui/material';
import { AccordionFilter, MenuTypographyDivider, MenuWithDiver } from './style';
import "./pointerFilter.css";

type Props = {
    getQueryPoints: (param: string, type: string) => void;
    disable: boolean;
    preSetVal?: any;
    label?: any;
    trigger?: any;
    nullable?: boolean;
};

const PointerFilterWrapper: React.FC<Props> = ({ getQueryPoints, disable, preSetVal, label, trigger, nullable }) => {
    const [min, setMin] = React.useState<any>(null);
    const [max, setMax] = React.useState<any>(null);

    const minFn = (e: any) => {
        let val = e.target.value;
        if (Number(val) > 0) {
            setMin(val);
        } else {
            setMin(null);
        }
        getQueryPoints(val, "min");
    };

    const maxFn = (e: any) => {
        let val = e.target.value;
        if (Number(val) > 0) {
            setMax(val);
        } else {
            setMax('');
        }
        getQueryPoints(val, "max");
    };

    const diffFn = () => {
        if (parseInt(min) > parseInt(max)) {
            setMax(min);
            getQueryPoints(min, "max");
        }
    };

    const allPointsFn = () => {
        setMax(null);
        setMin(null);
        getQueryPoints("", "empty");
    };

    React.useEffect(() => {
        if ((min?.length || max?.length) === "") {
            setMax(null);
            setMin(null);
            getQueryPoints("", "empty");
        }
    }, [min, max]);

    React.useEffect(() => {
        setMax(null);
        setMin(null);
        getQueryPoints("", "empty");
    }, []);

    React.useEffect(() => {
        if (nullable) {
            setMax(preSetVal?.max || null);
            setMin(preSetVal?.min || null);
            getQueryPoints(preSetVal?.min, "min");
            getQueryPoints(preSetVal?.max, "max");
        } else if (preSetVal) {
            setMax(preSetVal?.max);
            setMin(preSetVal?.min);
            getQueryPoints(preSetVal?.min, "min");
            getQueryPoints(preSetVal?.max, "max");
        }
    }, [preSetVal, trigger]);

    return (
        <Grid item xs={2} className={`currAppDropFilter ${disable ? "disableWrapper" : ""}`}>
            <FormControl size="small">
                <div className="currAppPointsMenuBox-wrapper">
                    <MenuWithDiver disableRipple onClick={allPointsFn}>
                        {label === "marks" ? "All Marks" : "All Points"}
                    </MenuWithDiver>
                    {/* <hr className='allMarksHorizon'/> */}
                    <AccordionFilter>
                        <div className="points_input_wrapper">
                            <TextField
                                value={min || ''}
                                onChange={(e: any) => minFn(e)}
                                label="Min*"
                                variant="outlined"
                                className="schAdminSelctCtr"
                                style={{ width: "50%" }}
                                autoComplete="off"
                                onBlur={diffFn}
                                data-testid="min..."
                            />
                            <TextField
                                value={max || ''}
                                onChange={(e) => maxFn(e)}
                                label="Max*"
                                variant="outlined"
                                className="schAdminSelctCtr"
                                style={{ width: "50%" }}
                                onBlur={diffFn}
                                autoComplete="off"
                                data-testid="max..."
                            />
                        </div>
                    </AccordionFilter>
                </div>
            </FormControl>
        </Grid>
    );
};

export default PointerFilterWrapper;

import * as assert from 'assert';

import {VALID, INVALID} from './consts';

import validate from '../../ts/validation';
import {Config} from '../../ts/validation/types';

describe('Validation', function () {
    // Tests pass if `validate` doesn't throw an error
    describe('VALID', function () {
        for (const [i, title] of VALID.TITLES.entries()) {
            for (const [j, tree] of VALID.TREES.entries()) {
                for (const [k, userStyles] of VALID.USER_STYLES.entries()) {
                    it(`${i},${j},${k}`, () => validate({title, tree, userStyles}));

                    for (const [l, defaultStyle] of VALID.DEV_STYLES.entries()) {
                        it(`${i},${j},${k},${l}`, () => validate({title, tree, userStyles, defaultStyle}));
                    }
                }
            }
        }
    });

    describe('INVALID', function () {
        const validConfig: Config = {
            'title': VALID.TITLES[0],
            'tree': VALID.TREES[0],
            'userStyles': VALID.USER_STYLES[0],
            'defaultStyle': VALID.DEV_STYLES[0]
        };

        function test(property, values) {
            describe(property, () => {
                for (const [i, value] of values.entries()) {
                    it(i.toString(), () => {
                        assert.throws(() => validate({
                            ...validConfig,
                            [property]: value
                        }));
                    });
                }
            });
        }

        test('title', INVALID.TITLES);
        test('tree', INVALID.TREES);
        test('userStyles', INVALID.USER_STYLES);
        test('defaultStyle', INVALID.DEV_STYLES);
    });
});

/* global describe it */

import {VALID, INVALID} from './consts';

import validate from '../../ts/validation';

import type {Config} from '../../ts/validation/types';

describe('Validation', function () {
	// Tests pass if `validate` doesn't throw an error
	describe('VALID', function () {
		for (const [i, title] of VALID.TITLES.entries()) {
			for (const [j, defaultTree] of VALID.TREES.entries()) {
				for (const [k, userStyles] of VALID.USER_STYLES.entries()) {
					it(`${i},${j},${k}`, () => validate({title, defaultTree, userStyles}));
					
					for (const [l, defaultStyle] of VALID.DEV_STYLES.entries()) {
						it(`${i},${j},${k},${l}`, () => validate({title, defaultTree, userStyles, defaultStyle}));
					}
				}
			}
		}
	});
	
	describe('INVALID', function () {
		const validConfig: Config = {
			title: VALID.TITLES[0],
			defaultTree: VALID.TREES[0],
			userStyles: VALID.USER_STYLES[0],
			defaultStyle: VALID.DEV_STYLES[0],
		};
		
		function test(property, values) {
			describe(property, () => {
				for (const [i, value] of values.entries()) {
					it(i.toString(), async () => {
						try {
							await validate({
								...validConfig,
								[property]: value,
							});
						} catch (e) {
							return;
						}
						
						throw new Error();
					});
				}
			});
		}
		
		test('title', INVALID.TITLES);
		test('defaultTree', INVALID.TREES);
		test('userStyles', INVALID.USER_STYLES);
		test('defaultStyle', INVALID.DEV_STYLES);
	});
});

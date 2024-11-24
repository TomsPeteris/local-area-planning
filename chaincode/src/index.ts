/*
 * SPDX-License-Identifier: Apache-2.0
 */

import {type Contract} from 'fabric-contract-api';
import {LocalAreaPlanningContract} from './localAreaPlanning';

export const contracts: typeof Contract[] = [LocalAreaPlanningContract];

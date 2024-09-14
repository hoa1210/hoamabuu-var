<?php

/*
 * This file is part of hoa1210/hoamabu.
 *
 * Copyright (c) 2024 HoaDepTrai.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Hoa1210\Hoamabu;

use Flarum\Extend;
use Flarum\Frontend\Document;
use Psr\Http\Message\ServerRequestInterface as Request;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/css/forum.css')
        ->route('/sao-ke-tien-ung-ho-bao-yagi', 'hoa1210/hoamabuu'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    new Extend\Locales(__DIR__ . '/locale'),
];

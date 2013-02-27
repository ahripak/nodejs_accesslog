<?php

/**
 * Node.js Access Log settings form.
 *
 * @todo Probably should add a textarea with newline separated
 *       paths to exclude, like ajax callbacks and such.
 * @todo Add settings for which elements show up on the default
 *       page, so you can turn off the linechart or map.
 */
function nodejs_accesslog_admin_form($form, &$form_state) {

  // This setting will determine what periods to group the requests
  $form['nodejs_accesslog_period'] = array(
    '#type' => 'select',
    '#title' => t('Logging period'),
    '#options' => array(
      1 => t('1 min'),
      5 => t('5 min'),
      15 => t('15 min'),
    ),
    '#default_value' => variable_get('nodejs_accesslog_period', 5),
  );

  return system_settings_form($form);
}
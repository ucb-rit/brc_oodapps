'use strict'

/**
 *   Toggle the visibility of a form group
 *  
 *   @param      {string}    form_id  The form identifier
 *   @param      {boolean}   show     Whether to show or hide
 */
function toggle_visibility_of_form_group(form_id, show) {
  let form_element = $(form_id);
  let parent = form_element.parent();

  if(show) {
    parent.show();
  } else {
    form_element.val('');
    parent.hide();
  }
}

/**
 *  Toggle the visibility of the GRES Value field
 */
function toggle_gres_value_field_visibility() {
  let slurm_partition = $("#batch_connect_session_context_slurm_partition");
  let gpu_partitions = [
    'savio2_gpu', 'savio2_1080ti', 'savio3_gpu'
  ];

  toggle_visibility_of_form_group(
    '#batch_connect_session_context_gres_value',
    gpu_partitions.includes(slurm_partition.val()));
}

/**
 * Toggle the visibility of the CPU cores field 
 */
function toggle_cpu_cores_field_visibility() {
  let slurm_partition = $("#batch_connect_session_context_slurm_partition");
  let per_core_partitions = [
    'savio2_gpu', 'savio2_1080ti', 'savio3_gpu', 'savio2_htc', 'savio2_knl', 'savio3_htc'
  ];

  toggle_visibility_of_form_group(
    '#batch_connect_session_context_num_cores',
    per_core_partitions.includes(slurm_partition.val()));
}

/**
 * Toggle the visibility of the SLURM Account and QOS fields
 */
function toggle_slurm_account_qos_fields_visibility() {
  let slurm_partition = $("#batch_connect_session_context_slurm_partition");
  let non_account_partition = [ 'vector' ];

  toggle_visibility_of_form_group(
    '#batch_connect_session_context_bc_account',
    !non_account_partition.includes(slurm_partition.val()));

  toggle_visibility_of_form_group(
    '#batch_connect_session_context_qos_name',
    !non_account_partition.includes(slurm_partition.val()));
}


/**
 * Sets the change handler for the slurm partition select.
 */
function set_slurm_partition_change_handler() {
  let slurm_partition = $("#batch_connect_session_context_slurm_partition");
  slurm_partition.change(() => {
    toggle_gres_value_field_visibility();
    toggle_cpu_cores_field_visibility();
    toggle_slurm_account_qos_fields_visibility();
  });
}

/**
 *  Install event handlers
 */
$(document).ready(function() {
  // Ensure that fields are shown or hidden based on what was set in the last session
  toggle_gres_value_field_visibility();
  toggle_cpu_cores_field_visibility();
  toggle_slurm_account_qos_fields_visibility();

  set_slurm_partition_change_handler();
});


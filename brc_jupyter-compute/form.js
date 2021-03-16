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
    update_available_options();
  });
}

function get_associations() {
  const raw_data = $('#batch_connect_session_context_raw_data').val();
  const assocs = [];
  for (const assoc of raw_data.split(" ").filter(x => x)) {
    const [partition, account, qos_list] = assoc.split("|");
    assocs.push({ partition, account, qos: qos_list.split(",") });
  }
  return assocs;
}

function replace_options($select, new_options) {
  const old_selection = $select.val();
  $select.empty();
  new_options.sort().map(option => $select.append($("<option></option>").attr("value", option).text(option)));
  if (new_options.includes(old_selection)) {
    $select.val(old_selection);
  }
}

function set_available_accounts() {
  const assocs = get_associations();
  const accounts = [...new Set(assocs.map(({ account }) => account))];
  replace_options($("#batch_connect_session_context_slurm_account"), accounts);
}

function set_available_partitions() {
  let assocs = get_associations();
  const selected_account = $("#batch_connect_session_context_slurm_account").val();
  assocs = assocs.filter(({ account }) => account === selected_account);
  const partitions = assocs.map(({ partition }) => partition);
  replace_options($("#batch_connect_session_context_slurm_partition"), partitions);
}

function set_available_qos() {
  const assocs = get_associations();
  const selected_account = $("#batch_connect_session_context_slurm_account").val();
  const selected_partition = $("#batch_connect_session_context_slurm_partition").val();
  const qos = assocs
    .filter(({ account, partition }) => (account === selected_account && partition === selected_partition))[0].qos;
  replace_options($("#batch_connect_session_context_qos_name"), qos);
}

function update_available_options() {
  set_available_partitions();
  set_available_qos();
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

  set_available_accounts();
  $("#batch_connect_session_context_slurm_account").change(update_available_options);
  update_available_options();
});


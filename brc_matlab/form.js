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

/**
 *  Toggle the visibility of the GRES Value field
 */
function toggle_gres_value_field_visibility() {
  let slurm_partition = $("#batch_connect_session_context_slurm_partition");
  let gpu_partitions = [
    'savio2_gpu', 'savio2_1080ti', 'savio3_gpu', 'savio4_gpu'
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
    'savio2_htc','savio3_htc','savio4_htc','savio2_gpu','savio3_gpu','savio2_1080ti', 'savio4_gpu'
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
    '#batch_connect_session_context_slurm_account',
    !non_account_partition.includes(slurm_partition.val()));

  toggle_visibility_of_form_group(
    '#batch_connect_session_context_qos_name',
    !non_account_partition.includes(slurm_partition.val()));
}

function set_available_accounts() {
  let assocs = get_associations();
  const selected_partition = $("#batch_connect_session_context_slurm_partition").val();
  assocs = assocs.filter(({ partition }) => partition === selected_partition);
  const accounts = assocs.map(({ account }) => account);
  replace_options($("#batch_connect_session_context_slurm_account"), accounts);
}

function set_available_qos() {
  const assocs = get_associations();
  const selected_account = $("#batch_connect_session_context_slurm_account").val();
  const selected_partition = $("#batch_connect_session_context_slurm_partition").val();
  const allqos = assocs
    .filter(({ account, partition }) => (account === selected_account && partition === selected_partition))[0].qos;
  const non_existent_qos = 'normal';
  const qos = allqos.filter(qos => qos !== non_existent_qos);
  replace_options($("#batch_connect_session_context_qos_name"), qos);
}

function set_max_time() {
  const selected_qos = $("#batch_connect_session_context_qos_name").val();
  if (selected_qos === "savio_debug") {
    $("#batch_connect_session_context_bc_num_hours").val(1);
    $("#batch_connect_session_context_bc_num_hours").attr("max", 1);
  } else {
    $("#batch_connect_session_context_bc_num_hours").attr("max", "");
  }
}

function update_available_options() {
  set_available_accounts();
  set_available_qos();
  set_max_time();  
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

/**
 * Sets the change handler for the slurm qos select.
 */
function set_slurm_qos_change_handler() {
  let slurm_qos = $("#batch_connect_session_context_qos_name");
  slurm_qos.change(() => {
    update_available_options();
  });
}


/**
 * Sets the change handler for the slurm account select.
 */
function set_slurm_account_change_handler() {
  const slurm_account = $("#batch_connect_session_context_slurm_account");
  slurm_account.change(() => {
    update_available_options();
  });
}

function set_available_partitions() {
  const assocs = get_associations();
  const allpartitions = [...new Set(assocs.map(({ partition }) => partition))];
  // Skip on partition value of cortex as that is an obsolete partition now
  const non_existent_partition = 'cortex';
  const partitions = allpartitions.filter(partition => partition !== non_existent_partition);
  replace_options($("#batch_connect_session_context_slurm_partition"), partitions);
}

/**
 *  Install event handlers
 */
$(document).ready(function() {
  set_available_partitions();
  // Ensure that fields are shown or hidden based on what was set in the last session
  toggle_gres_value_field_visibility();
  toggle_cpu_cores_field_visibility();
  toggle_slurm_account_qos_fields_visibility();
  // Update available options appropriately
  update_available_options();

  set_slurm_partition_change_handler();
  set_slurm_qos_change_handler();
  set_slurm_account_change_handler();
});


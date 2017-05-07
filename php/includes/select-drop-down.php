<?php
  //retrieve tables and store for use locally
  //$magnetometerArray = retrieveTable("magnetometer");
 ?>
 <!--<script>
 var jsMagnetometerArray = <?php //echo json_encode($magnetometerArray);?>;
 </script>-->

<h2>Choose Date</h2>
<select id="select-year">
  <option value="2013">2013</option>
  <option value="2014">2014</option>
  <option value="2015">2015</option>
  <option class="leap-year" value="2016">2016</option>
  <option value="2017">2017</option>
</select>
<select id="select-month">
  <option class="31day" value="0">01</option>
  <option class="feb" value="31">02</option>
  <option class="31day" value="59">03</option>
  <option class="30day" value="90">04</option>
  <option class="31day" value="120">05</option>
  <option class="30day" value="151">06</option>
  <option class="31day" value="181">07</option>
  <option class="31day" value="212">08</option>
  <option class="30day" value="243">09</option>
  <option class="31day" value="273">10</option>
  <option class="30day" value="304">11</option>
  <option class="31day" value="334">12</option>
</select>
<select id="select-day">
  <option value="0">01</option>
  <option value="1">02</option>
  <option value="2">03</option>
  <option value="3">04</option>
  <option value="4">05</option>
  <option value="5">06</option>
  <option value="6">07</option>
  <option value="7">08</option>
  <option value="8">09</option>
  <option value="9">10</option>
  <option value="10">11</option>
  <option value="11">12</option>
  <option value="12">13</option>
  <option value="13">14</option>
  <option value="14">15</option>
  <option value="15">16</option>
  <option value="16">17</option>
  <option value="17">18</option>
  <option value="18">19</option>
  <option value="19">20</option>
  <option value="20">21</option>
  <option value="21">22</option>
  <option value="22">23</option>
  <option value="23">24</option>
  <option value="24">25</option>
  <option value="25">26</option>
  <option value="26">27</option>
  <option value="27">28</option>
  <option value="28">29</option>
  <option value="29">30</option>
  <option value="30">31</option>
</select>
<button id="show-data" type="button">Go</button>

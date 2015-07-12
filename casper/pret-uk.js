/*
 * to scrape pret.co.uk
 - request link is:
 - https://www.pret.co.uk/en-gb/find-a-pret/ub1/
 - where ub1 is a uk prefix code
 - loop over prefixes array
 - read h3 as shop names
 - read attribute data-position as geolocation
 */

'use strict';
var i = -1,
  shopInfo = [],
  shopNames = [],
  links = [],
  shopCoords = [],
  linksAndNames = [],
  page = [],
  pageData = [],
  cityQty,
  globals = {};

var prefixes = ['AB10', 'AB11', 'AB12', 'AB13', 'AB14', 'AB15', 'AB16', 'AB21', 'AB22', 'AB23', 'AB24', 'AB25', 'AB30', 'AB31', 'AB32', 'AB33', 'AB34', 'AB35', 'AB36', 'AB37', 'AB38', 'AB39', 'AB41', 'AB42', 'AB43', 'AB44', 'AB45', 'AB51', 'AB52', 'AB53', 'AB54', 'AB55', 'AB56', 'AB99', 'AL1', 'AL10', 'AL2', 'AL3', 'AL4', 'AL5', 'AL6', 'AL7', 'AL8', 'AL9', 'B1', 'B10', 'B11', 'B12', 'B13', 'B14', 'B15', 'B16', 'B17', 'B18', 'B19', 'B2', 'B20', 'B21', 'B23', 'B24', 'B25', 'B26', 'B27', 'B28', 'B29', 'B3', 'B30', 'B31', 'B32', 'B33', 'B34', 'B35', 'B36', 'B37', 'B38', 'B4', 'B40', 'B42', 'B43', 'B44', 'B45', 'B46', 'B47', 'B48', 'B49', 'B5', 'B50', 'B6', 'B60', 'B61', 'B62', 'B63', 'B64', 'B65', 'B66', 'B67', 'B68', 'B69', 'B7', 'B70', 'B71', 'B72', 'B73', 'B74', 'B75', 'B76', 'B77', 'B78', 'B79', 'B8', 'B80', 'B9', 'B90', 'B91', 'B92', 'B93', 'B94', 'B95', 'B96', 'B97', 'B98', 'B99', 'BA1', 'BA10', 'BA11', 'BA12', 'BA13', 'BA14', 'BA15', 'BA16', 'BA2', 'BA20', 'BA21', 'BA22', 'BA3', 'BA4', 'BA5', 'BA6', 'BA7', 'BA8', 'BA9', 'BB1', 'BB10', 'BB11', 'BB12', 'BB18', 'BB2', 'BB3', 'BB4', 'BB5', 'BB6', 'BB7', 'BB8', 'BB9', 'BB94', 'BD1', 'BD10', 'BD11', 'BD12', 'BD13', 'BD14', 'BD15', 'BD16', 'BD17', 'BD18', 'BD19', 'BD2', 'BD20', 'BD21', 'BD22', 'BD23', 'BD24', 'BD3', 'BD4', 'BD5', 'BD6', 'BD7', 'BD8', 'BD9', 'BD97', 'BD98', 'BD99', 'BH1', 'BH10', 'BH11', 'BH12', 'BH13', 'BH14', 'BH15', 'BH16', 'BH17', 'BH18', 'BH19', 'BH2', 'BH20', 'BH21', 'BH22', 'BH23', 'BH24', 'BH25', 'BH3', 'BH31', 'BH4', 'BH5', 'BH6', 'BH7', 'BH8', 'BH9', 'BL0', 'BL1', 'BL11', 'BL2', 'BL3', 'BL4', 'BL5', 'BL6', 'BL7', 'BL78', 'BL8', 'BL9', 'BN1', 'BN10', 'BN11', 'BN12', 'BN13', 'BN14', 'BN15', 'BN16', 'BN17', 'BN18', 'BN2', 'BN20', 'BN21', 'BN22', 'BN23', 'BN24', 'BN25', 'BN26', 'BN27', 'BN3', 'BN41', 'BN42', 'BN43', 'BN44', 'BN45', 'BN5', 'BN50', 'BN51', 'BN52', 'BN6', 'BN7', 'BN8', 'BN88', 'BN9', 'BN99', 'BR1', 'BR2', 'BR3', 'BR4', 'BR5', 'BR6', 'BR7', 'BR8', 'BS1', 'BS10', 'BS11', 'BS13', 'BS14', 'BS15', 'BS16', 'BS2', 'BS20', 'BS21', 'BS22', 'BS23', 'BS24', 'BS25', 'BS26', 'BS27', 'BS28', 'BS29', 'BS3', 'BS30', 'BS31', 'BS32', 'BS34', 'BS35', 'BS36', 'BS37', 'BS39', 'BS4', 'BS40', 'BS41', 'BS48', 'BS49', 'BS5', 'BS6', 'BS7', 'BS8', 'BS80', 'BS9', 'BS98', 'BS99', 'BT1', 'BT10', 'BT11', 'BT12', 'BT13', 'BT14', 'BT15', 'BT16', 'BT17', 'BT18', 'BT19', 'BT2', 'BT20', 'BT21', 'BT22', 'BT23', 'BT24', 'BT25', 'BT26', 'BT27', 'BT28', 'BT29', 'BT3', 'BT30', 'BT31', 'BT32', 'BT33', 'BT34', 'BT35', 'BT36', 'BT37', 'BT38', 'BT39', 'BT4', 'BT40', 'BT41', 'BT42', 'BT43', 'BT44', 'BT45', 'BT46', 'BT47', 'BT48', 'BT49', 'BT5', 'BT51', 'BT52', 'BT53', 'BT54', 'BT55', 'BT56', 'BT57', 'BT58', 'BT6', 'BT60', 'BT61', 'BT62', 'BT63', 'BT64', 'BT65', 'BT66', 'BT67', 'BT68', 'BT69', 'BT7', 'BT70', 'BT71', 'BT74', 'BT75', 'BT76', 'BT77', 'BT78', 'BT79', 'BT8', 'BT80', 'BT81', 'BT82', 'BT9', 'BT92', 'BT93', 'BT94', 'CA1', 'CA10', 'CA11', 'CA12', 'CA13', 'CA14', 'CA15', 'CA16', 'CA17', 'CA18', 'CA19', 'CA2', 'CA20', 'CA21', 'CA22', 'CA23', 'CA24', 'CA25', 'CA26', 'CA27', 'CA28', 'CA3', 'CA4', 'CA5', 'CA6', 'CA7', 'CA8', 'CA9', 'CA95', 'CA99', 'CB1', 'CB10', 'CB11', 'CB2', 'CB21', 'CB22', 'CB23', 'CB24', 'CB25', 'CB3', 'CB4', 'CB5', 'CB6', 'CB7', 'CB8', 'CB9', 'CF10', 'CF11', 'CF14', 'CF15', 'CF23', 'CF24', 'CF3', 'CF30', 'CF31', 'CF32', 'CF33', 'CF34', 'CF35', 'CF36', 'CF37', 'CF38', 'CF39', 'CF40', 'CF41', 'CF42', 'CF43', 'CF44', 'CF45', 'CF46', 'CF47', 'CF48', 'CF5', 'CF61', 'CF62', 'CF63', 'CF64', 'CF71', 'CF72', 'CF81', 'CF82', 'CF83', 'CF91', 'CF95', 'CF99', 'CH1', 'CH2', 'CH25', 'CH26', 'CH27', 'CH28', 'CH29', 'CH3', 'CH30', 'CH31', 'CH32', 'CH33', 'CH34', 'CH4', 'CH41', 'CH42', 'CH43', 'CH44', 'CH45', 'CH46', 'CH47', 'CH48', 'CH49', 'CH5', 'CH6', 'CH60', 'CH61', 'CH62', 'CH63', 'CH64', 'CH65', 'CH66', 'CH7', 'CH70', 'CH8', 'CH88', 'CH99', 'CM0', 'CM1', 'CM11', 'CM12', 'CM13', 'CM14', 'CM15', 'CM16', 'CM17', 'CM18', 'CM19', 'CM2', 'CM20', 'CM21', 'CM22', 'CM23', 'CM24', 'CM3', 'CM4', 'CM5', 'CM6', 'CM7', 'CM77', 'CM8', 'CM9', 'CM92', 'CM98', 'CM99', 'CO1', 'CO10', 'CO11', 'CO12', 'CO13', 'CO14', 'CO15', 'CO16', 'CO2', 'CO3', 'CO4', 'CO5', 'CO6', 'CO7', 'CO8', 'CO9', 'CR0', 'CR2', 'CR3', 'CR4', 'CR44', 'CR5', 'CR6', 'CR7', 'CR8', 'CR9', 'CR90', 'CT1', 'CT10', 'CT11', 'CT12', 'CT13', 'CT14', 'CT15', 'CT16', 'CT17', 'CT18', 'CT19', 'CT2', 'CT20', 'CT21', 'CT3', 'CT4', 'CT5', 'CT50', 'CT6', 'CT7', 'CT8', 'CT9', 'CV1', 'CV10', 'CV11', 'CV12', 'CV13', 'CV2', 'CV21', 'CV22', 'CV23', 'CV3', 'CV31', 'CV32', 'CV33', 'CV34', 'CV35', 'CV36', 'CV37', 'CV4', 'CV47', 'CV5', 'CV6', 'CV7', 'CV8', 'CV9', 'CW1', 'CW10', 'CW11', 'CW12', 'CW2', 'CW3', 'CW4', 'CW5', 'CW6', 'CW7', 'CW8', 'CW9', 'CW98', 'DA1', 'DA10', 'DA11', 'DA12', 'DA13', 'DA14', 'DA15', 'DA16', 'DA17', 'DA18', 'DA2', 'DA3', 'DA4', 'DA5', 'DA6', 'DA7', 'DA8', 'DA9', 'DD1', 'DD10', 'DD11', 'DD2', 'DD3', 'DD4', 'DD5', 'DD6', 'DD7', 'DD8', 'DD9', 'DE1', 'DE11', 'DE12', 'DE13', 'DE14', 'DE15', 'DE21', 'DE22', 'DE23', 'DE24', 'DE3', 'DE4', 'DE45', 'DE5', 'DE55', 'DE56', 'DE6', 'DE65', 'DE7', 'DE72', 'DE73', 'DE74', 'DE75', 'DE99', 'DG1', 'DG10', 'DG11', 'DG12', 'DG13', 'DG14', 'DG16', 'DG2', 'DG3', 'DG4', 'DG5', 'DG6', 'DG7', 'DG8', 'DG9', 'DH1', 'DH2', 'DH3', 'DH4', 'DH5', 'DH6', 'DH7', 'DH8', 'DH9', 'DH97', 'DH98', 'DH99', 'DL1', 'DL10', 'DL11', 'DL12', 'DL13', 'DL14', 'DL15', 'DL16', 'DL17', 'DL2', 'DL3', 'DL4', 'DL5', 'DL6', 'DL7', 'DL8', 'DL9', 'DN1', 'DN10', 'DN11', 'DN12', 'DN14', 'DN15', 'DN16', 'DN17', 'DN18', 'DN19', 'DN2', 'DN20', 'DN21', 'DN22', 'DN3', 'DN31', 'DN32', 'DN33', 'DN34', 'DN35', 'DN36', 'DN37', 'DN38', 'DN39', 'DN4', 'DN40', 'DN41', 'DN5', 'DN55', 'DN6', 'DN7', 'DN8', 'DN9', 'DT1', 'DT10', 'DT11', 'DT2', 'DT3', 'DT4', 'DT5', 'DT6', 'DT7', 'DT8', 'DT9', 'DY1', 'DY10', 'DY11', 'DY12', 'DY13', 'DY14', 'DY2', 'DY3', 'DY4', 'DY5', 'DY6', 'DY7', 'DY8', 'DY9', 'E1', 'E10', 'E11', 'E12', 'E13', 'E14', 'E15', 'E16', 'E17', 'E18', 'E1W', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E77', 'E8', 'E9', 'E98', 'EC1A', 'EC1M', 'EC1N', 'EC1P', 'EC1R', 'EC1V', 'EC1Y', 'EC2A', 'EC2M', 'EC2N', 'EC2P', 'EC2R', 'EC2V', 'EC2Y', 'EC3A', 'EC3M', 'EC3N', 'EC3P', 'EC3R', 'EC3V', 'EC4A', 'EC4M', 'EC4N', 'EC4P', 'EC4R', 'EC4V', 'EC4Y', 'EC50', 'EH1', 'EH10', 'EH11', 'EH12', 'EH13', 'EH14', 'EH15', 'EH16', 'EH17', 'EH18', 'EH19', 'EH2', 'EH20', 'EH21', 'EH22', 'EH23', 'EH24', 'EH25', 'EH26', 'EH27', 'EH28', 'EH29', 'EH3', 'EH30', 'EH31', 'EH32', 'EH33', 'EH34', 'EH35', 'EH36', 'EH37', 'EH38', 'EH39', 'EH4', 'EH40', 'EH41', 'EH42', 'EH43', 'EH44', 'EH45', 'EH46', 'EH47', 'EH48', 'EH49', 'EH5', 'EH51', 'EH52', 'EH53', 'EH54', 'EH55', 'EH6', 'EH7', 'EH8', 'EH9', 'EH91', 'EH95', 'EH99', 'EN1', 'EN10', 'EN11', 'EN2', 'EN3', 'EN4', 'EN5', 'EN6', 'EN7', 'EN8', 'EN9', 'EX1', 'EX10', 'EX11', 'EX12', 'EX13', 'EX14', 'EX15', 'EX16', 'EX17', 'EX18', 'EX19', 'EX2', 'EX20', 'EX21', 'EX22', 'EX23', 'EX24', 'EX3', 'EX31', 'EX32', 'EX33', 'EX34', 'EX35', 'EX36', 'EX37', 'EX38', 'EX39', 'EX4', 'EX5', 'EX6', 'EX7', 'EX8', 'EX9', 'FK1', 'FK10', 'FK11', 'FK12', 'FK13', 'FK14', 'FK15', 'FK16', 'FK17', 'FK18', 'FK19', 'FK2', 'FK20', 'FK21', 'FK3', 'FK4', 'FK5', 'FK6', 'FK7', 'FK8', 'FK9', 'FY0', 'FY1', 'FY2', 'FY3', 'FY4', 'FY5', 'FY6', 'FY7', 'FY8', 'G1', 'G11', 'G12', 'G13', 'G14', 'G15', 'G2', 'G20', 'G21', 'G22', 'G23', 'G3', 'G31', 'G32', 'G33', 'G34', 'G4', 'G40', 'G41', 'G42', 'G43', 'G44', 'G45', 'G46', 'G5', 'G51', 'G52', 'G53', 'G58', 'G60', 'G61', 'G62', 'G63', 'G64', 'G65', 'G66', 'G67', 'G68', 'G69', 'G70', 'G71', 'G72', 'G73', 'G74', 'G75', 'G76', 'G77', 'G78', 'G79', 'G81', 'G82', 'G83', 'G84', 'G9', 'G90', 'GL1', 'GL10', 'GL11', 'GL12', 'GL13', 'GL14', 'GL15', 'GL16', 'GL17', 'GL18', 'GL19', 'GL2', 'GL20', 'GL3', 'GL4', 'GL5', 'GL50', 'GL51', 'GL52', 'GL53', 'GL54', 'GL55', 'GL56', 'GL6', 'GL7', 'GL8', 'GL9', 'GU1', 'GU10', 'GU11', 'GU12', 'GU14', 'GU15', 'GU16', 'GU17', 'GU18', 'GU19', 'GU2', 'GU20', 'GU21', 'GU22', 'GU23', 'GU24', 'GU25', 'GU26', 'GU27', 'GU28', 'GU29', 'GU3', 'GU30', 'GU31', 'GU32', 'GU33', 'GU34', 'GU35', 'GU4', 'GU46', 'GU47', 'GU5', 'GU51', 'GU52', 'GU6', 'GU7', 'GU8', 'GU9', 'GU95', 'GY1', 'GY2', 'GY3', 'GY4', 'GY5', 'GY6', 'GY7', 'GY8', 'GY9', 'HA0', 'HA1', 'HA2', 'HA3', 'HA4', 'HA5', 'HA6', 'HA7', 'HA8', 'HA9', 'HD1', 'HD2', 'HD3', 'HD4', 'HD5', 'HD6', 'HD7', 'HD8', 'HD9', 'HG1', 'HG2', 'HG3', 'HG4', 'HG5', 'HP1', 'HP10', 'HP11', 'HP12', 'HP13', 'HP14', 'HP15', 'HP16', 'HP17', 'HP18', 'HP19', 'HP2', 'HP20', 'HP21', 'HP22', 'HP23', 'HP27', 'HP3', 'HP4', 'HP5', 'HP6', 'HP7', 'HP8', 'HP9', 'HR1', 'HR2', 'HR3', 'HR4', 'HR5', 'HR6', 'HR7', 'HR8', 'HR9', 'HS1', 'HS2', 'HS3', 'HS4', 'HS5', 'HS6', 'HS7', 'HS8', 'HS9', 'HU1', 'HU10', 'HU11', 'HU12', 'HU13', 'HU14', 'HU15', 'HU16', 'HU17', 'HU18', 'HU19', 'HU2', 'HU20', 'HU3', 'HU4', 'HU5', 'HU6', 'HU7', 'HU8', 'HU9', 'HX1', 'HX2', 'HX3', 'HX4', 'HX5', 'HX6', 'HX7', 'IG1', 'IG10', 'IG11', 'IG2', 'IG3', 'IG4', 'IG5', 'IG6', 'IG7', 'IG8', 'IG9', 'IM1', 'IM2', 'IM3', 'IM4', 'IM5', 'IM6', 'IM7', 'IM8', 'IM9', 'IM99', 'IP1', 'IP10', 'IP11', 'IP12', 'IP13', 'IP14', 'IP15', 'IP16', 'IP17', 'IP18', 'IP19', 'IP2', 'IP20', 'IP21', 'IP22', 'IP23', 'IP24', 'IP25', 'IP26', 'IP27', 'IP28', 'IP29', 'IP3', 'IP30', 'IP31', 'IP32', 'IP33', 'IP4', 'IP5', 'IP6', 'IP7', 'IP8', 'IP9', 'IP98', 'IV1', 'IV10', 'IV11', 'IV12', 'IV13', 'IV14', 'IV15', 'IV16', 'IV17', 'IV18', 'IV19', 'IV2', 'IV20', 'IV21', 'IV22', 'IV23', 'IV24', 'IV25', 'IV26', 'IV27', 'IV28', 'IV3', 'IV30', 'IV31', 'IV32', 'IV36', 'IV4', 'IV40', 'IV41', 'IV42', 'IV43', 'IV44', 'IV45', 'IV46', 'IV47', 'IV48', 'IV49', 'IV5', 'IV51', 'IV52', 'IV53', 'IV54', 'IV55', 'IV56', 'IV6', 'IV63', 'IV7', 'IV8', 'IV9', 'IV99', 'JE1', 'JE2', 'JE3', 'JE4', 'JE5', 'KA1', 'KA10', 'KA11', 'KA12', 'KA13', 'KA14', 'KA15', 'KA16', 'KA17', 'KA18', 'KA19', 'KA2', 'KA20', 'KA21', 'KA22', 'KA23', 'KA24', 'KA25', 'KA26', 'KA27', 'KA28', 'KA29', 'KA3', 'KA30', 'KA4', 'KA5', 'KA6', 'KA7', 'KA8', 'KA9', 'KT1', 'KT10', 'KT11', 'KT12', 'KT13', 'KT14', 'KT15', 'KT16', 'KT17', 'KT18', 'KT19', 'KT2', 'KT20', 'KT21', 'KT22', 'KT23', 'KT24', 'KT3', 'KT4', 'KT5', 'KT6', 'KT7', 'KT8', 'KT9', 'KW1', 'KW10', 'KW11', 'KW12', 'KW13', 'KW14', 'KW15', 'KW16', 'KW17', 'KW2', 'KW3', 'KW5', 'KW6', 'KW7', 'KW8', 'KW9', 'KY1', 'KY10', 'KY11', 'KY12', 'KY13', 'KY14', 'KY15', 'KY16', 'KY2', 'KY3', 'KY4', 'KY5', 'KY6', 'KY7', 'KY8', 'KY9', 'KY99', 'L1', 'L10', 'L11', 'L12', 'L13', 'L14', 'L15', 'L16', 'L17', 'L18', 'L19', 'L2', 'L20', 'L21', 'L22', 'L23', 'L24', 'L25', 'L26', 'L27', 'L28', 'L29', 'L3', 'L30', 'L31', 'L32', 'L33', 'L34', 'L35', 'L36', 'L37', 'L38', 'L39', 'L4', 'L40', 'L5', 'L6', 'L67', 'L68', 'L69', 'L7', 'L70', 'L71', 'L72', 'L73', 'L74', 'L75', 'L8', 'L9', 'LA1', 'LA10', 'LA11', 'LA12', 'LA13', 'LA14', 'LA15', 'LA16', 'LA17', 'LA18', 'LA19', 'LA2', 'LA20', 'LA21', 'LA22', 'LA23', 'LA3', 'LA4', 'LA5', 'LA6', 'LA7', 'LA8', 'LA9', 'LD1', 'LD2', 'LD3', 'LD4', 'LD5', 'LD6', 'LD7', 'LD8', 'LE1', 'LE10', 'LE11', 'LE12', 'LE13', 'LE14', 'LE15', 'LE16', 'LE17', 'LE18', 'LE19', 'LE2', 'LE21', 'LE3', 'LE4', 'LE41', 'LE5', 'LE55', 'LE6', 'LE65', 'LE67', 'LE7', 'LE8', 'LE87', 'LE9', 'LE94', 'LE95', 'LL11', 'LL12', 'LL13', 'LL14', 'LL15', 'LL16', 'LL17', 'LL18', 'LL19', 'LL20', 'LL21', 'LL22', 'LL23', 'LL24', 'LL25', 'LL26', 'LL27', 'LL28', 'LL29', 'LL30', 'LL31', 'LL32', 'LL33', 'LL34', 'LL35', 'LL36', 'LL37', 'LL38', 'LL39', 'LL40', 'LL41', 'LL42', 'LL43', 'LL44', 'LL45', 'LL46', 'LL47', 'LL48', 'LL49', 'LL51', 'LL52', 'LL53', 'LL54', 'LL55', 'LL56', 'LL57', 'LL58', 'LL59', 'LL60', 'LL61', 'LL62', 'LL63', 'LL64', 'LL65', 'LL66', 'LL67', 'LL68', 'LL69', 'LL70', 'LL71', 'LL72', 'LL73', 'LL74', 'LL75', 'LL76', 'LL77', 'LL78', 'LN1', 'LN10', 'LN11', 'LN12', 'LN13', 'LN2', 'LN3', 'LN4', 'LN5', 'LN6', 'LN7', 'LN8', 'LN9', 'LS1', 'LS10', 'LS11', 'LS12', 'LS13', 'LS14', 'LS15', 'LS16', 'LS17', 'LS18', 'LS19', 'LS2', 'LS20', 'LS21', 'LS22', 'LS23', 'LS24', 'LS25', 'LS26', 'LS27', 'LS28', 'LS29', 'LS3', 'LS4', 'LS5', 'LS6', 'LS7', 'LS8', 'LS88', 'LS9', 'LS98', 'LS99', 'LU1', 'LU2', 'LU3', 'LU4', 'LU5', 'LU6', 'LU7', 'M1', 'M11', 'M12', 'M13', 'M14', 'M15', 'M16', 'M17', 'M18', 'M19', 'M2', 'M20', 'M21', 'M22', 'M23', 'M24', 'M25', 'M26', 'M27', 'M28', 'M29', 'M3', 'M30', 'M31', 'M32', 'M33', 'M34', 'M35', 'M38', 'M4', 'M40', 'M41', 'M43', 'M44', 'M45', 'M46', 'M5', 'M50', 'M6', 'M60', 'M61', 'M7', 'M8', 'M9', 'M90', 'M99', 'ME1', 'ME10', 'ME11', 'ME12', 'ME13', 'ME14', 'ME15', 'ME16', 'ME17', 'ME18', 'ME19', 'ME2', 'ME20', 'ME3', 'ME4', 'ME5', 'ME6', 'ME7', 'ME8', 'ME9', 'ME99', 'MK1', 'MK10', 'MK11', 'MK12', 'MK13', 'MK14', 'MK15', 'MK16', 'MK17', 'MK18', 'MK19', 'MK2', 'MK3', 'MK4', 'MK40', 'MK41', 'MK42', 'MK43', 'MK44', 'MK45', 'MK46', 'MK5', 'MK6', 'MK7', 'MK77', 'MK8', 'MK9', 'ML1', 'ML10', 'ML11', 'ML12', 'ML2', 'ML3', 'ML4', 'ML5', 'ML6', 'ML7', 'ML8', 'ML9', 'N1', 'N10', 'N11', 'N12', 'N13', 'N14', 'N15', 'N16', 'N17', 'N18', 'N19', 'N1P', 'N2', 'N20', 'N21', 'N22', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8', 'N81', 'N9', 'NE1', 'NE10', 'NE11', 'NE12', 'NE13', 'NE15', 'NE16', 'NE17', 'NE18', 'NE19', 'NE2', 'NE20', 'NE21', 'NE22', 'NE23', 'NE24', 'NE25', 'NE26', 'NE27', 'NE28', 'NE29', 'NE3', 'NE30', 'NE31', 'NE32', 'NE33', 'NE34', 'NE35', 'NE36', 'NE37', 'NE38', 'NE39', 'NE4', 'NE40', 'NE41', 'NE42', 'NE43', 'NE44', 'NE45', 'NE46', 'NE47', 'NE48', 'NE49', 'NE5', 'NE6', 'NE61', 'NE62', 'NE63', 'NE64', 'NE65', 'NE66', 'NE67', 'NE68', 'NE69', 'NE7', 'NE70', 'NE71', 'NE8', 'NE82', 'NE83', 'NE85', 'NE88', 'NE9', 'NE92', 'NE98', 'NE99', 'NG1', 'NG10', 'NG11', 'NG12', 'NG13', 'NG14', 'NG15', 'NG16', 'NG17', 'NG18', 'NG19', 'NG2', 'NG20', 'NG21', 'NG22', 'NG23', 'NG24', 'NG25', 'NG3', 'NG31', 'NG32', 'NG33', 'NG34', 'NG4', 'NG5', 'NG6', 'NG7', 'NG70', 'NG8', 'NG80', 'NG9', 'NG90', 'NN1', 'NN10', 'NN11', 'NN12', 'NN13', 'NN14', 'NN15', 'NN16', 'NN17', 'NN18', 'NN2', 'NN29', 'NN3', 'NN4', 'NN5', 'NN6', 'NN7', 'NN8', 'NN9', 'NP10', 'NP11', 'NP12', 'NP13', 'NP15', 'NP16', 'NP18', 'NP19', 'NP20', 'NP22', 'NP23', 'NP24', 'NP25', 'NP26', 'NP4', 'NP44', 'NP7', 'NP8', 'NR1', 'NR10', 'NR11', 'NR12', 'NR13', 'NR14', 'NR15', 'NR16', 'NR17', 'NR18', 'NR19', 'NR2', 'NR20', 'NR21', 'NR22', 'NR23', 'NR24', 'NR25', 'NR26', 'NR27', 'NR28', 'NR29', 'NR3', 'NR30', 'NR31', 'NR32', 'NR33', 'NR34', 'NR35', 'NR4', 'NR5', 'NR6', 'NR7', 'NR8', 'NR9', 'NR99', 'NW1', 'NW10', 'NW11', 'NW1W', 'NW2', 'NW26', 'NW3', 'NW4', 'NW5', 'NW6', 'NW7', 'NW8', 'NW9', 'OL1', 'OL10', 'OL11', 'OL12', 'OL13', 'OL14', 'OL15', 'OL16', 'OL2', 'OL3', 'OL4', 'OL5', 'OL6', 'OL7', 'OL8', 'OL9', 'OL95', 'OX1', 'OX10', 'OX11', 'OX12', 'OX13', 'OX14', 'OX15', 'OX16', 'OX17', 'OX18', 'OX2', 'OX20', 'OX25', 'OX26', 'OX27', 'OX28', 'OX29', 'OX3', 'OX33', 'OX39', 'OX4', 'OX44', 'OX49', 'OX5', 'OX7', 'OX9', 'PA1', 'PA10', 'PA11', 'PA12', 'PA13', 'PA14', 'PA15', 'PA16', 'PA17', 'PA18', 'PA19', 'PA2', 'PA20', 'PA21', 'PA22', 'PA23', 'PA24', 'PA25', 'PA26', 'PA27', 'PA28', 'PA29', 'PA3', 'PA30', 'PA31', 'PA32', 'PA33', 'PA34', 'PA35', 'PA36', 'PA37', 'PA38', 'PA4', 'PA41', 'PA42', 'PA43', 'PA44', 'PA45', 'PA46', 'PA47', 'PA48', 'PA49', 'PA5', 'PA6', 'PA60', 'PA61', 'PA62', 'PA63', 'PA64', 'PA65', 'PA66', 'PA67', 'PA68', 'PA69', 'PA7', 'PA70', 'PA71', 'PA72', 'PA73', 'PA74', 'PA75', 'PA76', 'PA77', 'PA78', 'PA8', 'PA9', 'PE1', 'PE10', 'PE11', 'PE12', 'PE13', 'PE14', 'PE15', 'PE16', 'PE19', 'PE2', 'PE20', 'PE21', 'PE22', 'PE23', 'PE24', 'PE25', 'PE26', 'PE27', 'PE28', 'PE29', 'PE3', 'PE30', 'PE31', 'PE32', 'PE33', 'PE34', 'PE35', 'PE36', 'PE37', 'PE38', 'PE4', 'PE5', 'PE6', 'PE7', 'PE8', 'PE9', 'PE99', 'PH1', 'PH10', 'PH11', 'PH12', 'PH13', 'PH14', 'PH15', 'PH16', 'PH17', 'PH18', 'PH19', 'PH2', 'PH20', 'PH21', 'PH22', 'PH23', 'PH24', 'PH25', 'PH26', 'PH3', 'PH30', 'PH31', 'PH32', 'PH33', 'PH34', 'PH35', 'PH36', 'PH37', 'PH38', 'PH39', 'PH4', 'PH40', 'PH41', 'PH42', 'PH43', 'PH44', 'PH49', 'PH5', 'PH50', 'PH6', 'PH7', 'PH8', 'PH9', 'PL1', 'PL10', 'PL11', 'PL12', 'PL13', 'PL14', 'PL15', 'PL16', 'PL17', 'PL18', 'PL19', 'PL2', 'PL20', 'PL21', 'PL22', 'PL23', 'PL24', 'PL25', 'PL26', 'PL27', 'PL28', 'PL29', 'PL3', 'PL30', 'PL31', 'PL32', 'PL33', 'PL34', 'PL35', 'PL4', 'PL5', 'PL6', 'PL7', 'PL8', 'PL9', 'PL95', 'PO1', 'PO10', 'PO11', 'PO12', 'PO13', 'PO14', 'PO15', 'PO16', 'PO17', 'PO18', 'PO19', 'PO2', 'PO20', 'PO21', 'PO22', 'PO3', 'PO30', 'PO31', 'PO32', 'PO33', 'PO34', 'PO35', 'PO36', 'PO37', 'PO38', 'PO39', 'PO4', 'PO40', 'PO41', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PR0', 'PR1', 'PR11', 'PR2', 'PR25', 'PR26', 'PR3', 'PR4', 'PR5', 'PR6', 'PR7', 'PR8', 'PR9', 'RG1', 'RG10', 'RG12', 'RG14', 'RG17', 'RG18', 'RG19', 'RG2', 'RG20', 'RG21', 'RG22', 'RG23', 'RG24', 'RG25', 'RG26', 'RG27', 'RG28', 'RG29', 'RG30', 'RG31', 'RG4', 'RG40', 'RG41', 'RG42', 'RG45', 'RG5', 'RG6', 'RG7', 'RG8', 'RG9', 'RH1', 'RH10', 'RH11', 'RH12', 'RH13', 'RH14', 'RH15', 'RH16', 'RH17', 'RH18', 'RH19', 'RH2', 'RH20', 'RH3', 'RH4', 'RH5', 'RH6', 'RH7', 'RH77', 'RH8', 'RH9', 'RM1', 'RM10', 'RM11', 'RM12', 'RM13', 'RM14', 'RM15', 'RM16', 'RM17', 'RM18', 'RM19', 'RM2', 'RM20', 'RM3', 'RM4', 'RM5', 'RM6', 'RM7', 'RM8', 'RM9', 'S1', 'S10', 'S11', 'S12', 'S13', 'S14', 'S17', 'S18', 'S2', 'S20', 'S21', 'S25', 'S26', 'S3', 'S32', 'S33', 'S35', 'S36', 'S4', 'S40', 'S41', 'S42', 'S43', 'S44', 'S45', 'S49', 'S5', 'S6', 'S60', 'S61', 'S62', 'S63', 'S64', 'S65', 'S66', 'S7', 'S70', 'S71', 'S72', 'S73', 'S74', 'S75', 'S8', 'S80', 'S81', 'S9', 'S96', 'S97', 'S98', 'S99', 'SA1', 'SA10', 'SA11', 'SA12', 'SA13', 'SA14', 'SA15', 'SA16', 'SA17', 'SA18', 'SA19', 'SA2', 'SA20', 'SA3', 'SA31', 'SA32', 'SA33', 'SA34', 'SA35', 'SA36', 'SA37', 'SA38', 'SA39', 'SA4', 'SA40', 'SA41', 'SA42', 'SA43', 'SA44', 'SA45', 'SA46', 'SA47', 'SA48', 'SA5', 'SA6', 'SA61', 'SA62', 'SA63', 'SA64', 'SA65', 'SA66', 'SA67', 'SA68', 'SA69', 'SA7', 'SA70', 'SA71', 'SA72', 'SA73', 'SA8', 'SA80', 'SA9', 'SA99', 'SE1', 'SE10', 'SE11', 'SE12', 'SE13', 'SE14', 'SE15', 'SE16', 'SE17', 'SE18', 'SE19', 'SE1P', 'SE2', 'SE20', 'SE21', 'SE22', 'SE23', 'SE24', 'SE25', 'SE26', 'SE27', 'SE28', 'SE3', 'SE4', 'SE5', 'SE6', 'SE7', 'SE8', 'SE9', 'SG1', 'SG10', 'SG11', 'SG12', 'SG13', 'SG14', 'SG15', 'SG16', 'SG17', 'SG18', 'SG19', 'SG2', 'SG3', 'SG4', 'SG5', 'SG6', 'SG7', 'SG8', 'SG9', 'SK1', 'SK10', 'SK11', 'SK12', 'SK13', 'SK14', 'SK15', 'SK16', 'SK17', 'SK2', 'SK22', 'SK23', 'SK3', 'SK4', 'SK5', 'SK6', 'SK7', 'SK8', 'SK9', 'SL0', 'SL1', 'SL2', 'SL3', 'SL4', 'SL5', 'SL6', 'SL60', 'SL7', 'SL8', 'SL9', 'SL95', 'SM1', 'SM2', 'SM3', 'SM4', 'SM5', 'SM6', 'SM7', 'SN1', 'SN10', 'SN11', 'SN12', 'SN13', 'SN14', 'SN15', 'SN16', 'SN2', 'SN25', 'SN26', 'SN3', 'SN38', 'SN4', 'SN5', 'SN6', 'SN7', 'SN8', 'SN9', 'SN99', 'SO14', 'SO15', 'SO16', 'SO17', 'SO18', 'SO19', 'SO20', 'SO21', 'SO22', 'SO23', 'SO24', 'SO30', 'SO31', 'SO32', 'SO40', 'SO41', 'SO42', 'SO43', 'SO45', 'SO50', 'SO51', 'SO52', 'SO53', 'SO97', 'SP1', 'SP10', 'SP11', 'SP2', 'SP3', 'SP4', 'SP5', 'SP6', 'SP7', 'SP8', 'SP9', 'SR1', 'SR2', 'SR3', 'SR4', 'SR5', 'SR6', 'SR7', 'SR8', 'SR9', 'SS0', 'SS1', 'SS11', 'SS12', 'SS13', 'SS14', 'SS15', 'SS16', 'SS17', 'SS2', 'SS22', 'SS3', 'SS4', 'SS5', 'SS6', 'SS7', 'SS8', 'SS9', 'SS99', 'ST1', 'ST10', 'ST11', 'ST12', 'ST13', 'ST14', 'ST15', 'ST16', 'ST17', 'ST18', 'ST19', 'ST2', 'ST20', 'ST21', 'ST3', 'ST4', 'ST5', 'ST55', 'ST6', 'ST7', 'ST8', 'ST9', 'SW10', 'SW11', 'SW12', 'SW13', 'SW14', 'SW15', 'SW16', 'SW17', 'SW18', 'SW19', 'SW1A', 'SW1E', 'SW1H', 'SW1P', 'SW1V', 'SW1W', 'SW1X', 'SW1Y', 'SW2', 'SW20', 'SW3', 'SW4', 'SW5', 'SW6', 'SW7', 'SW8', 'SW9', 'SW95', 'SW99', 'SY1', 'SY10', 'SY11', 'SY12', 'SY13', 'SY14', 'SY15', 'SY16', 'SY17', 'SY18', 'SY19', 'SY2', 'SY20', 'SY21', 'SY22', 'SY23', 'SY24', 'SY25', 'SY3', 'SY4', 'SY5', 'SY6', 'SY7', 'SY8', 'SY9', 'SY99', 'TA1', 'TA10', 'TA11', 'TA12', 'TA13', 'TA14', 'TA15', 'TA16', 'TA17', 'TA18', 'TA19', 'TA2', 'TA20', 'TA21', 'TA22', 'TA23', 'TA24', 'TA3', 'TA4', 'TA5', 'TA6', 'TA7', 'TA8', 'TA9', 'TD1', 'TD10', 'TD11', 'TD12', 'TD13', 'TD14', 'TD15', 'TD2', 'TD3', 'TD4', 'TD5', 'TD6', 'TD7', 'TD8', 'TD9', 'TF1', 'TF10', 'TF11', 'TF12', 'TF13', 'TF2', 'TF3', 'TF4', 'TF5', 'TF6', 'TF7', 'TF8', 'TF9', 'TN1', 'TN10', 'TN11', 'TN12', 'TN13', 'TN14', 'TN15', 'TN16', 'TN17', 'TN18', 'TN19', 'TN2', 'TN20', 'TN21', 'TN22', 'TN23', 'TN24', 'TN25', 'TN26', 'TN27', 'TN28', 'TN29', 'TN3', 'TN30', 'TN31', 'TN32', 'TN33', 'TN34', 'TN35', 'TN36', 'TN37', 'TN38', 'TN39', 'TN4', 'TN40', 'TN5', 'TN6', 'TN7', 'TN8', 'TN9', 'TQ1', 'TQ10', 'TQ11', 'TQ12', 'TQ13', 'TQ14', 'TQ2', 'TQ3', 'TQ4', 'TQ5', 'TQ6', 'TQ7', 'TQ8', 'TQ9', 'TR1', 'TR10', 'TR11', 'TR12', 'TR13', 'TR14', 'TR15', 'TR16', 'TR17', 'TR18', 'TR19', 'TR2', 'TR20', 'TR21', 'TR22', 'TR23', 'TR24', 'TR25', 'TR26', 'TR27', 'TR3', 'TR4', 'TR5', 'TR6', 'TR7', 'TR8', 'TR9', 'TR93', 'TS1', 'TS10', 'TS11', 'TS12', 'TS13', 'TS14', 'TS15', 'TS16', 'TS17', 'TS18', 'TS19', 'TS2', 'TS20', 'TS21', 'TS22', 'TS23', 'TS24', 'TS25', 'TS26', 'TS27', 'TS28', 'TS29', 'TS3', 'TS4', 'TS5', 'TS6', 'TS7', 'TS8', 'TS9', 'TW1', 'TW10', 'TW11', 'TW12', 'TW13', 'TW14', 'TW15', 'TW16', 'TW17', 'TW18', 'TW19', 'TW2', 'TW20', 'TW3', 'TW4', 'TW5', 'TW6', 'TW7', 'TW8', 'TW9', 'UB1', 'UB10', 'UB11', 'UB18', 'UB2', 'UB3', 'UB4', 'UB5', 'UB6', 'UB7', 'UB8', 'UB9', 'W10', 'W11', 'W12', 'W13', 'W14', 'W1A', 'W1B', 'W1C', 'W1D', 'W1F', 'W1G', 'W1H', 'W1J', 'W1K', 'W1S', 'W1T', 'W1U', 'W1W', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'WA1', 'WA10', 'WA11', 'WA12', 'WA13', 'WA14', 'WA15', 'WA16', 'WA2', 'WA3', 'WA4', 'WA5', 'WA55', 'WA6', 'WA7', 'WA8', 'WA88', 'WA9', 'WC1A', 'WC1B', 'WC1E', 'WC1H', 'WC1N', 'WC1R', 'WC1V', 'WC1X', 'WC2A', 'WC2B', 'WC2E', 'WC2H', 'WC2N', 'WC2R', 'WD17', 'WD18', 'WD19', 'WD23', 'WD24', 'WD25', 'WD3', 'WD4', 'WD5', 'WD6', 'WD7', 'WD99', 'WF1', 'WF10', 'WF11', 'WF12', 'WF13', 'WF14', 'WF15', 'WF16', 'WF17', 'WF2', 'WF3', 'WF4', 'WF5', 'WF6', 'WF7', 'WF8', 'WF9', 'WF90', 'WN1', 'WN2', 'WN3', 'WN4', 'WN5', 'WN6', 'WN7', 'WN8', 'WR1', 'WR10', 'WR11', 'WR12', 'WR13', 'WR14', 'WR15', 'WR2', 'WR3', 'WR4', 'WR5', 'WR6', 'WR7', 'WR78', 'WR8', 'WR9', 'WR99', 'WS1', 'WS10', 'WS11', 'WS12', 'WS13', 'WS14', 'WS15', 'WS2', 'WS3', 'WS4', 'WS5', 'WS6', 'WS7', 'WS8', 'WS9', 'WV1', 'WV10', 'WV11', 'WV12', 'WV13', 'WV14', 'WV15', 'WV16', 'WV2', 'WV3', 'WV4', 'WV5', 'WV6', 'WV7', 'WV8', 'WV9', 'YO1', 'YO10', 'YO11', 'YO12', 'YO13', 'YO14', 'YO15', 'YO16', 'YO17', 'YO18', 'YO19', 'YO21', 'YO22', 'YO23', 'YO24', 'YO25', 'YO26', 'YO30', 'YO31', 'YO32', 'YO41', 'YO42', 'YO43', 'YO51', 'YO60', 'YO61', 'YO62', 'YO7', 'YO8', 'YO90', 'YO91', 'YO95', 'ZE1', 'ZE2', 'ZE3'];
var startExecutionTime = new Date().getTime();

var casper = require('casper').create({
  verbose: 0,
  logLevel: 'debug',
  pageSettings: {
    loadImages: false,
    loadPlugins: false
  }
});
casper.options.waitTimeout = 20000;

// this func removes repetitve elements from arrays
function onlyUnique(items) {
  for (var ix = 0; ix < items.length; ix++) {
    var listI = items[ix];
    loopJ: for (var jx = 0; jx < items.length; jx++) {
      var listJ = items[jx];
      if (listI === listJ) {
        continue;
      } //Ignore itself
      for (var kx = listJ.length; kx >= 0; kx--) {
        if (listJ[kx] !== listI[kx]) {
          continue loopJ;
        }
      }
      // At this point, their values are equal.
      items.splice(jx, 1);
    }
  }

  return items;
}

function saveToFile(finalData, branchName) {

  var date = new Date(),
  minute = ('0' + date.getMinutes()).slice(-2),
  day = ('0' + date.getDate()).slice(-2),
  hours = ('0' + (date.getHours())).slice(-2),
  month = ('0' + (date.getMonth() + 1)).slice(-2),
  year = date.getFullYear();
  var fs = require('fs');

  var fname = branchName + '-' + year + month + day + '-' + hours + minute + '.txt';
  var savePath = fs.pathJoin(fs.workingDirectory, 'output', fname);
  fs.write(savePath, JSON.stringify(finalData), 'w');

  var completionTime = new Date().getTime();
  var executionTime = (completionTime - startExecutionTime) / 60000;
  var fLogName = 'main-report.txt';
  var report = '\n ----------- ' +
    'Date: ' +
    year + '/' + month + '/' + day + '  ' + hours + ':' + minute +
    ' ----------- \n ' +
    'Branch name: ' +
    branchName +
    '\n Number of shops returned: ' +
    finalData.length +
    '\n Execution Time (minute): ' +
    executionTime +
    '\n Results are saved in: \n' +
    savePath +
    '\n ---\n';

  var logSavePath = fs.pathJoin(fs.workingDirectory, 'output', fLogName);
  fs.write(logSavePath, report, 'a');

  casper.echo(JSON.stringify(finalData));
  casper.echo('------------------------== REPORT ==----------------');
  casper.echo(report);
}

casper.echo('\n\n **IMPORTANT** This script won\'t work without this param: --ssl-protocol=tlsv1 **IMPORTANT** \n', 'INFO');

var baseUrl = 'https://www.pret.co.uk/en-gb/find-a-pret/ub1/';

casper.start(baseUrl);

casper.then(function repeatWrapper(){
  casper.repeat(prefixes.length / 5, function openPrefs(){
    casper.then(function changeBase(){
      casper.log(prefixes[i]);
      baseUrl = 'https://www.pret.co.uk/en-gb/find-a-pret/' + prefixes[i] + '/';
      casper.open(baseUrl);
    });
    casper.then(function readPage(){
      shopNames = casper.evaluate(function(){
        var namesTags = document.querySelectorAll('.panel-heading>h3');
        var names = Array.prototype.map.call(namesTags, function(val){
          return val.innerHTML; });

      return names;
  });

      shopCoords = casper.evaluate(function(){
        var geoData = document.querySelectorAll('[data-position]');
        var arGeo = Array.prototype.map.call(geoData, function(val){return val.getAttribute('data-position'); });
        return arGeo;

      });
    });
    casper.then(function organizeData(){
      var latLong = [];

      // shopCoords is like ["lat,lon","lat2,lon2"..] break into seperate els
      if(shopCoords) {
       latLong = shopCoords.map(function(val){
         return val.split(',');
       });
      }
      for(var k = 0; k < latLong.length; k++) {
        pageData [k] = [parseFloat(latLong[k][0]), parseFloat(latLong[k][1]), shopNames[k]];
        shopInfo.push(pageData[k]);
      }

      // remove duplicates in each loop
      onlyUnique(shopInfo);
      casper.echo('Area ' + i + ' of ' + prefixes.length / 5 );
    i = i + 5;
    });
  });

});

casper.then(function readGlobalVar(){
});

casper.then(function saveLogBye(){
  saveToFile(shopInfo, 'pret-uk');
});

casper.run();
